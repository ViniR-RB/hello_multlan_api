import { Injectable } from '@nestjs/common';

import { compare, hash } from 'bcryptjs';
import ConfigurationService from './configuration.service';
@Injectable()
export class EncryptionService {
  constructor(private readonly configurationService: ConfigurationService) {}

  async hash(anyString: string): Promise<string> {
    try {
      return await hash(anyString, this.configurationService.get('SALT'));
    } catch (error) {
      throw error;
    }
  }
  async isMatch(hashedString: string, normalString: string): Promise<boolean> {
    try {
      return await compare(normalString, hashedString);
    } catch (error) {
      throw error;
    }
  }
}
