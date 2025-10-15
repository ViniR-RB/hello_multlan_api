export default abstract class Formmaters {
  /**
   * Capitaliza apenas a primeira letra da string
   * @param value - String a ser formatada
   * @returns String com a primeira letra maiúscula
   */
  static capitalizeFirstLetter(value: string): string {
    if (!value) return value;
    return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
  }

  /**
   * Capitaliza a primeira letra de cada palavra (após espaços)
   * @param value - String a ser formatada
   * @returns String com cada palavra iniciando em maiúscula
   */
  static capitalizeWords(value: string): string {
    if (!value) return value;
    return value
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
