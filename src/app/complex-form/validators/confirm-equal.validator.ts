import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function confirmEqualValidator(
  main: string,
  confirm: string
): ValidatorFn {
  return (ctrl: AbstractControl): null | ValidationErrors => {
    let result: any = { confirmEqual: 'Invalid control names' };

    if (ctrl.get(main) && ctrl.get(confirm)) {
      const mainValue = ctrl.get(main)!.value;
      const confirmValue = ctrl.get(confirm)!.value;
      result =
        mainValue === confirmValue
          ? null
          : {
              confirmEqual: { main: mainValue, confirm: confirmValue },
            };
    }

    return result;
  };
}
