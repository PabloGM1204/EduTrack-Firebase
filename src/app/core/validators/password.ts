import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";
export class PasswordValidation {
    
    public static passwordProto(controlName:string=''): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            let password = '';
            if(control instanceof FormControl)
                password = control?.value;
            else
                password = control.get(controlName)?.value;
            if(password && !password.match(/^(?=.*\d)(?=.*[a-zá-ú\u00f1ä-ü])(?=.*[A-ZÁ-Ú\u00d1Ä-Ü])[0-9a-zá-úä-üA-ZÁ-ÚÄ-Ü \u00d1$-/@:-?{-~!"^_`\[\]]{8,}$/)){
                return { 'passwordProto': true};
            }
            else{
                return null;
            }  
        }
    }
    public static passwordMatch(passwordControlName:string, confirmControlName:string):ValidatorFn{
        return (control: AbstractControl): ValidationErrors | null => {
            const password = control.get(passwordControlName)?.value;
            const confirmPassword = control.get(confirmControlName)?.value;
        
            if(password != confirmPassword){
                let errors = control?.errors;
                if (errors && typeof errors === 'object') {
                Object.assign(errors, {
                    'passwordMatch': true
                });
                } else {
                errors = {
                    'passwordMatch': true
                };
                }
                return errors;
            }
            else{
                let errors = control?.errors;
                if (errors && typeof errors === 'object') {
                if(errors['passwordMatch'])
                    delete errors['passwordMatch'];
                }
                return control.errors; 
            }
        }
    }
  }