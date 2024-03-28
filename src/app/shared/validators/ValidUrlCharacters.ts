import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function ValidURLCharacters(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const forbidden_characters = ['?', '&', '=', '_', '#', '@'];
    const value: string = control.value;

    const forbidden_characters_in_value = forbidden_characters.filter(
      (char: string) => {return value.includes(char);}
    );

    if (forbidden_characters_in_value.length > 0) {
      return {'forbidden characters found in value': forbidden_characters_in_value.toString()};  // Returning object as 'Invalid' with hint as to why
    }

    return null;  // Returning null is 'Valid'
  };
}
