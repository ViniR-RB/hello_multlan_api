import FileDomainException from '@/modules/file/exceptions/file_domain.exception';
import { randomUUID } from 'crypto';

interface FileEntityProps {
  id?: string;
  originalName: string;
  filename: string;
  buffer: Buffer;
  size: number;
  mimetype: string;
  encoding?: string;
}

export default class FileEntity {
  constructor(private readonly props: FileEntityProps) {
    this.validate(props);
    this.props = {
      id: props.id ?? randomUUID().toString(),
      originalName: props.originalName,
      filename: props.filename,
      buffer: props.buffer,
      size: props.size,
      mimetype: props.mimetype,
      encoding: props.encoding,
    };
  }

  private validate(props: FileEntityProps) {
    if (!props.originalName) {
      throw new FileDomainException('Original name is required');
    }
    if (!props.filename) {
      throw new FileDomainException('Filename is required');
    }

    if (props.size <= 0) {
      throw new FileDomainException('File size must be greater than zero');
    }
    if (!props.mimetype) {
      throw new FileDomainException('Mimetype is required');
    }
    if (!props.buffer || props.buffer.length === 0) {
      throw new FileDomainException('File buffer is required');
    }
  }

  get id() {
    return this.props.id!;
  }

  get originalName() {
    return this.props.originalName;
  }

  get filename() {
    return this.props.filename;
  }

  get size() {
    return this.props.size;
  }

  get mimetype() {
    return this.props.mimetype;
  }

  get encoding() {
    return this.props.encoding;
  }
  get buffer() {
    return this.props.buffer;
  }

  toObject() {
    return {
      id: this.id,
      originalName: this.originalName,
      filename: this.filename,
      buffer: this.buffer,
      size: this.size,
      mimetype: this.mimetype,
      encoding: this.encoding,
    };
  }
}
