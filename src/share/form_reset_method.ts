import { FormGroup } from "@angular/forms";

export function ResetForms(form: FormGroup) {
    form.reset();                // clear values
    form.markAsUntouched();      // remove touched state
    form.markAsPristine();       // remove dirty state
    // clear all error states
    Object.keys(form.controls).forEach(key => {
        const control = form.controls[key];
        control.setErrors(null);
    });
}