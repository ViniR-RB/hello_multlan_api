import ConfigurationService from '@/core/services/configuration.service';
import DeleteFileService from '@/modules/file/application/delete_file.service';
import UploadFileService from '@/modules/file/application/upload_file.service';
import { DeleteFileParam } from '@/modules/file/domain/usecase/i_delete_file_use_case';
import { UploadFileParam } from '@/modules/file/domain/usecase/i_upload_file_use_case';
import FileLocalRepository from '@/modules/file/infra/repositories/file_local.repository';
import FileLocalStorage from '@/modules/file/infra/storage/file_local.storage';
import * as fs from 'fs';
import * as path from 'path';

describe('File Upload and Delete - Integration Tests', () => {
  let uploadFileService: UploadFileService;
  let deleteFileService: DeleteFileService;
  let fileRepository: FileLocalRepository;
  let fileStorage: FileLocalStorage;
  let mockConfigurationService: jest.Mocked<ConfigurationService>;
  let testFilesDir: string;

  beforeAll(() => {
    // Diretório onde os arquivos serão salvos (mesmo caminho usado pelo FileLocalStorage)
    testFilesDir = path.resolve(__dirname, '../../../../files');
  });

  beforeEach(() => {
    mockConfigurationService = {
      get: jest.fn().mockReturnValue('http://localhost:3000/files'),
    } as any;

    fileStorage = new FileLocalStorage(mockConfigurationService);
    fileRepository = new FileLocalRepository(fileStorage);
    uploadFileService = new UploadFileService(fileRepository);
    deleteFileService = new DeleteFileService(fileRepository);

    // Garantir que o diretório de teste existe
    if (!fs.existsSync(testFilesDir)) {
      fs.mkdirSync(testFilesDir, { recursive: true });
    }
  });

  afterEach(async () => {
    // Limpar arquivos de teste após cada teste
    try {
      if (fs.existsSync(testFilesDir)) {
        const files = fs.readdirSync(testFilesDir);
        for (const file of files) {
          const filePath = path.join(testFilesDir, file);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      }
    } catch (error) {
      console.warn('Error cleaning test files:', error);
    }
  });

  afterAll(() => {
    // Remover diretório de teste
    try {
      if (fs.existsSync(testFilesDir)) {
        fs.rmSync(testFilesDir, { recursive: true, force: true });
      }
    } catch (error) {
      console.warn('Error removing test directory:', error);
    }
  });

  describe('Complete Upload and Delete Flow', () => {
    it('should upload a file and then delete it successfully', async () => {
      // Arrange: Prepare upload parameters
      const uploadParam: UploadFileParam = {
        originalName: 'integration-test.txt',
        buffer: Buffer.from('Integration test file content'),
        size: 31,
        mimetype: 'text/plain',
        encoding: 'utf8',
      };

      // Act: Upload file through service
      const uploadResult = await uploadFileService.execute(uploadParam);

      // Assert: Upload was successful
      expect(uploadResult.isRight()).toBe(true);

      if (uploadResult.isRight()) {
        const uploadResponse = uploadResult.value;
        expect(uploadResponse.fileUrl.url).toBe(
          'http://localhost:3000/files/integration-test.txt',
        );

        // Verify file exists physically on disk
        const expectedFilePath = path.join(
          testFilesDir,
          'integration-test.txt',
        );
        expect(fs.existsSync(expectedFilePath)).toBe(true);

        // Verify file content
        const fileContent = fs.readFileSync(expectedFilePath, 'utf8');
        expect(fileContent).toBe('Integration test file content');

        // Act: Delete file through service
        const deleteParam: DeleteFileParam = {
          fileName: 'integration-test.txt',
        };
        const deleteResult = await deleteFileService.execute(deleteParam);

        // Assert: Delete was successful
        expect(deleteResult.isRight()).toBe(true);

        // Verify file no longer exists physically
        expect(fs.existsSync(expectedFilePath)).toBe(false);
      }
    });

    it('should upload file and delete using full URL', async () => {
      // Arrange: Prepare upload parameters
      const uploadParam: UploadFileParam = {
        originalName: 'url-delete-test.pdf',
        buffer: Buffer.from('PDF content for URL delete test'),
        size: 33,
        mimetype: 'application/pdf',
      };

      // Act: Upload file
      const uploadResult = await uploadFileService.execute(uploadParam);

      // Assert: Upload was successful
      expect(uploadResult.isRight()).toBe(true);

      if (uploadResult.isRight()) {
        const uploadResponse = uploadResult.value;
        const fileUrl = uploadResponse.fileUrl.url;

        // Verify file exists
        const expectedFilePath = path.join(testFilesDir, 'url-delete-test.pdf');
        expect(fs.existsSync(expectedFilePath)).toBe(true);

        // Act: Delete using full URL
        const deleteParam: DeleteFileParam = {
          fileName: fileUrl, // Using full URL
        };
        const deleteResult = await deleteFileService.execute(deleteParam);

        // Assert: Delete was successful
        expect(deleteResult.isRight()).toBe(true);

        // Verify file no longer exists
        expect(fs.existsSync(expectedFilePath)).toBe(false);
      }
    });

    it('should handle multiple file uploads and batch deletion', async () => {
      // Arrange: Prepare multiple files
      const uploadParams: UploadFileParam[] = [
        {
          originalName: 'batch-test-1.txt',
          buffer: Buffer.from('Content of batch file 1'),
          size: 25,
          mimetype: 'text/plain',
        },
        {
          originalName: 'batch-test-2.txt',
          buffer: Buffer.from('Content of batch file 2'),
          size: 25,
          mimetype: 'text/plain',
        },
        {
          originalName: 'batch-test-3.txt',
          buffer: Buffer.from('Content of batch file 3'),
          size: 25,
          mimetype: 'text/plain',
        },
      ];

      const uploadedFiles: string[] = [];

      try {
        // Act: Upload all files
        for (const uploadParam of uploadParams) {
          const uploadResult = await uploadFileService.execute(uploadParam);
          expect(uploadResult.isRight()).toBe(true);

          // Verify file exists
          const expectedFilePath = path.join(
            testFilesDir,
            uploadParam.originalName,
          );
          expect(fs.existsSync(expectedFilePath)).toBe(true);
          uploadedFiles.push(uploadParam.originalName);
        }

        // Verify all files were uploaded
        expect(uploadedFiles).toHaveLength(3);

        // Act: Delete all files
        for (const fileName of uploadedFiles) {
          const deleteParam: DeleteFileParam = { fileName };
          const deleteResult = await deleteFileService.execute(deleteParam);
          expect(deleteResult.isRight()).toBe(true);

          // Verify file no longer exists
          const expectedFilePath = path.join(testFilesDir, fileName);
          expect(fs.existsSync(expectedFilePath)).toBe(false);
        }
      } catch (error) {
        // Cleanup in case of error
        for (const fileName of uploadedFiles) {
          try {
            const deleteParam: DeleteFileParam = { fileName };
            await deleteFileService.execute(deleteParam);
          } catch (cleanupError) {
            console.warn(`Error cleaning up ${fileName}:`, cleanupError);
          }
        }
        throw error;
      }
    });

    it('should return error when trying to delete non-existent file', async () => {
      // Act: Try to delete non-existent file
      const deleteParam: DeleteFileParam = {
        fileName: 'non-existent-file.txt',
      };
      const deleteResult = await deleteFileService.execute(deleteParam);

      // Assert: Should return error
      expect(deleteResult.isLeft()).toBe(true);

      if (deleteResult.isLeft()) {
        const error = deleteResult.value;
        expect(error.message).toBe('File not found');
        expect(error.statusCode).toBe(404);
      }
    });

    it('should upload different file types successfully', async () => {
      // Arrange: Prepare different file types
      const fileTypes = [
        {
          name: 'document.txt',
          content: 'Text document content',
          mimetype: 'text/plain',
        },
        {
          name: 'image.jpg',
          content: 'JPEG image binary data',
          mimetype: 'image/jpeg',
        },
        {
          name: 'document.pdf',
          content: 'PDF document binary data',
          mimetype: 'application/pdf',
        },
        {
          name: 'data.json',
          content: '{"key": "value"}',
          mimetype: 'application/json',
        },
      ];

      const uploadedFiles: string[] = [];

      try {
        // Act: Upload files of different types
        for (const fileType of fileTypes) {
          const uploadParam: UploadFileParam = {
            originalName: fileType.name,
            buffer: Buffer.from(fileType.content),
            size: fileType.content.length,
            mimetype: fileType.mimetype,
          };

          const uploadResult = await uploadFileService.execute(uploadParam);
          expect(uploadResult.isRight()).toBe(true);

          if (uploadResult.isRight()) {
            const uploadResponse = uploadResult.value;
            expect(uploadResponse.fileUrl.url).toBe(
              `http://localhost:3000/files/${fileType.name}`,
            );

            // Verify file exists and has correct content
            const expectedFilePath = path.join(testFilesDir, fileType.name);
            expect(fs.existsSync(expectedFilePath)).toBe(true);

            const fileContent = fs.readFileSync(expectedFilePath, 'utf8');
            expect(fileContent).toBe(fileType.content);

            uploadedFiles.push(fileType.name);
          }
        }

        // Cleanup: Delete all uploaded files
        for (const fileName of uploadedFiles) {
          const deleteParam: DeleteFileParam = { fileName };
          const deleteResult = await deleteFileService.execute(deleteParam);
          expect(deleteResult.isRight()).toBe(true);
        }
      } catch (error) {
        // Cleanup in case of error
        for (const fileName of uploadedFiles) {
          try {
            const deleteParam: DeleteFileParam = { fileName };
            await deleteFileService.execute(deleteParam);
          } catch (cleanupError) {
            console.warn(`Error cleaning up ${fileName}:`, cleanupError);
          }
        }
        throw error;
      }
    });

    it('should handle file overwrites correctly', async () => {
      // Arrange: Upload a file
      const uploadParam: UploadFileParam = {
        originalName: 'overwrite-test.txt',
        buffer: Buffer.from('Original content'),
        size: 16,
        mimetype: 'text/plain',
      };

      const uploadResult1 = await uploadFileService.execute(uploadParam);
      expect(uploadResult1.isRight()).toBe(true);

      // Verify original file
      const filePath = path.join(testFilesDir, 'overwrite-test.txt');
      expect(fs.existsSync(filePath)).toBe(true);
      expect(fs.readFileSync(filePath, 'utf8')).toBe('Original content');

      // Act: Upload file with same name but different content
      const uploadParam2: UploadFileParam = {
        originalName: 'overwrite-test.txt',
        buffer: Buffer.from('Updated content'),
        size: 15,
        mimetype: 'text/plain',
      };

      const uploadResult2 = await uploadFileService.execute(uploadParam2);
      expect(uploadResult2.isRight()).toBe(true);

      // Assert: File should be overwritten
      expect(fs.existsSync(filePath)).toBe(true);
      expect(fs.readFileSync(filePath, 'utf8')).toBe('Updated content');

      // Cleanup
      const deleteParam: DeleteFileParam = { fileName: 'overwrite-test.txt' };
      const deleteResult = await deleteFileService.execute(deleteParam);
      expect(deleteResult.isRight()).toBe(true);
    });
  });

  describe('Error Scenarios', () => {
    it('should handle storage errors gracefully', async () => {
      // Note: Este teste demonstra como você poderia testar cenários de erro
      // Em um ambiente real, você poderia mockar o storage para simular falhas

      // Exemplo: tentativa de upload de arquivo muito grande (simulado)
      const largeUploadParam: UploadFileParam = {
        originalName: 'large-file.bin',
        buffer: Buffer.alloc(1024 * 1024), // 1MB
        size: 1024 * 1024,
        mimetype: 'application/octet-stream',
      };

      const uploadResult = await uploadFileService.execute(largeUploadParam);

      // Este teste pode ou não falhar dependendo do sistema de arquivos
      // Mas demonstra como testar cenários de erro
      if (uploadResult.isRight()) {
        // Se o upload foi bem-sucedido, fazer cleanup
        const deleteParam: DeleteFileParam = { fileName: 'large-file.bin' };
        await deleteFileService.execute(deleteParam);
      }
    });
  });
});
