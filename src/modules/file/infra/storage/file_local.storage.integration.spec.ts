import ConfigurationService from '@/core/services/configuration.service';
import FileEntity from '@/modules/file/domain/entities/file.entity';
import FileLocalStorage from '@/modules/file/infra/storage/file_local.storage';
import * as fs from 'fs';
import * as path from 'path';

describe('FileLocalStorage - Integration Tests', () => {
  let fileStorage: FileLocalStorage;
  let mockConfigurationService: jest.Mocked<ConfigurationService>;
  let testFilesDir: string;
  let testFile: FileEntity;

  beforeAll(() => {
    // Diretório de teste isolado (mesmo padrão usado no teste de aplicação)
    testFilesDir = path.resolve(__dirname, '../../../../../files');
  });

  beforeEach(() => {
    mockConfigurationService = {
      get: jest.fn().mockReturnValue('http://localhost:3000/files'),
    } as any;

    fileStorage = new FileLocalStorage(mockConfigurationService);

    // Criar arquivo de teste
    testFile = new FileEntity({
      originalName: 'test-file.txt',
      filename: 'test-file.txt',
      buffer: Buffer.from('Test file content for integration testing'),
      size: 42,
      mimetype: 'text/plain',
      encoding: 'utf8',
    });

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

  describe('Integration: store and delete workflow', () => {
    it('should store a file physically on disk and then delete it successfully', async () => {
      // Act: Store file
      const storeResult = await fileStorage.store(testFile);

      // Assert: Store was successful
      expect(storeResult.isRight()).toBe(true);

      if (storeResult.isRight()) {
        const fileUrl = storeResult.value;
        expect(fileUrl.url).toBe('http://localhost:3000/files/test-file.txt');

        // Verify file exists physically on disk
        const expectedFilePath = path.resolve(
          __dirname,
          '../../../../../files/test-file.txt',
        );
        expect(fs.existsSync(expectedFilePath)).toBe(true);

        // Verify file content
        const fileContent = fs.readFileSync(expectedFilePath, 'utf8');
        expect(fileContent).toBe('Test file content for integration testing');

        // Act: Delete file
        const deleteResult = await fileStorage.delete('test-file.txt');

        // Assert: Delete was successful
        expect(deleteResult.isRight()).toBe(true);

        // Verify file no longer exists physically
        expect(fs.existsSync(expectedFilePath)).toBe(false);
      }
    });

    it('should store file and delete using full URL', async () => {
      // Act: Store file
      const storeResult = await fileStorage.store(testFile);

      // Assert: Store was successful
      expect(storeResult.isRight()).toBe(true);

      if (storeResult.isRight()) {
        const fileUrl = storeResult.value;

        // Act: Delete using full URL
        const deleteResult = await fileStorage.delete(fileUrl.url);

        // Assert: Delete was successful
        expect(deleteResult.isRight()).toBe(true);

        // Verify file no longer exists physically
        const expectedFilePath = path.resolve(
          __dirname,
          '../../../../../files/test-file.txt',
        );
        expect(fs.existsSync(expectedFilePath)).toBe(false);
      }
    });

    it('should create directory if it does not exist during store', async () => {
      // Arrange: Remove files directory if it exists
      const filesDir = path.resolve(__dirname, '../../../../../files');
      if (fs.existsSync(filesDir)) {
        fs.rmSync(filesDir, { recursive: true, force: true });
      }

      // Act: Store file
      const storeResult = await fileStorage.store(testFile);

      // Assert: Directory was created and file stored
      expect(storeResult.isRight()).toBe(true);
      expect(fs.existsSync(filesDir)).toBe(true);

      const expectedFilePath = path.join(filesDir, 'test-file.txt');
      expect(fs.existsSync(expectedFilePath)).toBe(true);

      // Cleanup
      const deleteResult = await fileStorage.delete('test-file.txt');
      expect(deleteResult.isRight()).toBe(true);
    });

    it('should return error when trying to delete non-existent file', async () => {
      // Act: Try to delete non-existent file
      const deleteResult = await fileStorage.delete('non-existent-file.txt');

      // Assert: Should return error
      expect(deleteResult.isLeft()).toBe(true);

      if (deleteResult.isLeft()) {
        const error = deleteResult.value;
        expect(error.message).toBe('File not found');
        expect(error.statusCode).toBe(404);
      }
    });

    it('should handle multiple files storage and deletion', async () => {
      // Arrange: Create multiple test files
      const testFiles = [
        new FileEntity({
          originalName: 'file1.txt',
          filename: 'file1.txt',
          buffer: Buffer.from('Content of file 1'),
          size: 17,
          mimetype: 'text/plain',
        }),
        new FileEntity({
          originalName: 'file2.txt',
          filename: 'file2.txt',
          buffer: Buffer.from('Content of file 2'),
          size: 17,
          mimetype: 'text/plain',
        }),
        new FileEntity({
          originalName: 'file3.txt',
          filename: 'file3.txt',
          buffer: Buffer.from('Content of file 3'),
          size: 17,
          mimetype: 'text/plain',
        }),
      ];

      const filesDir = path.resolve(__dirname, '../../../../../files');
      const storedFiles: string[] = [];

      try {
        // Act: Store all files
        for (const file of testFiles) {
          const storeResult = await fileStorage.store(file);
          expect(storeResult.isRight()).toBe(true);

          // Verify file exists
          const filePath = path.join(filesDir, file.originalName);
          expect(fs.existsSync(filePath)).toBe(true);
          storedFiles.push(file.originalName);
        }

        // Verify all files exist
        expect(storedFiles).toHaveLength(3);

        // Act: Delete all files
        for (const fileName of storedFiles) {
          const deleteResult = await fileStorage.delete(fileName);
          expect(deleteResult.isRight()).toBe(true);

          // Verify file no longer exists
          const filePath = path.join(filesDir, fileName);
          expect(fs.existsSync(filePath)).toBe(false);
        }
      } catch (error) {
        // Cleanup in case of error
        for (const fileName of storedFiles) {
          try {
            await fileStorage.delete(fileName);
          } catch (cleanupError) {
            console.warn(`Error cleaning up ${fileName}:`, cleanupError);
          }
        }
        throw error;
      }
    });
  });

  describe('Integration: exists method', () => {
    it('should correctly check file existence after store and delete', async () => {
      // Act: Check before storing
      const existsBeforeResult = await fileStorage.exists('test-file.txt');
      expect(existsBeforeResult.isRight()).toBe(true);
      if (existsBeforeResult.isRight()) {
        expect(existsBeforeResult.value).toBe(false);
      }

      // Store file
      const storeResult = await fileStorage.store(testFile);
      expect(storeResult.isRight()).toBe(true);

      // Act: Check after storing
      const existsAfterStoreResult = await fileStorage.exists('test-file.txt');
      expect(existsAfterStoreResult.isRight()).toBe(true);
      if (existsAfterStoreResult.isRight()) {
        expect(existsAfterStoreResult.value).toBe(true);
      }

      // Delete file
      const deleteResult = await fileStorage.delete('test-file.txt');
      expect(deleteResult.isRight()).toBe(true);

      // Act: Check after deleting
      const existsAfterDeleteResult = await fileStorage.exists('test-file.txt');
      expect(existsAfterDeleteResult.isRight()).toBe(true);
      if (existsAfterDeleteResult.isRight()) {
        expect(existsAfterDeleteResult.value).toBe(false);
      }
    });

    it('should check existence using full URL', async () => {
      // Store file
      const storeResult = await fileStorage.store(testFile);
      expect(storeResult.isRight()).toBe(true);

      if (storeResult.isRight()) {
        const fileUrl = storeResult.value;

        // Act: Check existence using full URL
        const existsResult = await fileStorage.exists(fileUrl.url);
        expect(existsResult.isRight()).toBe(true);
        if (existsResult.isRight()) {
          expect(existsResult.value).toBe(true);
        }

        // Cleanup
        await fileStorage.delete('test-file.txt');
      }
    });
  });

  describe('Integration: getFilePath method', () => {
    it('should return correct file path', () => {
      // Act
      const filePath = fileStorage.getFilePath('test-file.txt');

      // Assert
      const expectedPath = path.resolve(
        __dirname,
        '../../../../../files/test-file.txt',
      );
      expect(filePath).toBe(expectedPath);
    });
  });

  describe('Integration: Error handling', () => {
    it('should handle filesystem errors gracefully', async () => {
      // Este teste demonstra como você poderia testar cenários de erro
      // Por exemplo, tentando deletar um arquivo que já foi removido externamente

      // Store a file first
      const storeResult = await fileStorage.store(testFile);
      expect(storeResult.isRight()).toBe(true);

      // Manually remove the file to simulate external deletion
      const filePath = path.resolve(
        __dirname,
        '../../../../../files/test-file.txt',
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Try to delete the already removed file
      const deleteResult = await fileStorage.delete('test-file.txt');
      expect(deleteResult.isLeft()).toBe(true);

      if (deleteResult.isLeft()) {
        const error = deleteResult.value;
        expect(error.message).toBe('File not found');
        expect(error.statusCode).toBe(404);
      }
    });
  });
});
