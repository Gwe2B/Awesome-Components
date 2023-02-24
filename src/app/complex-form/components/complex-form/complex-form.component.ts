import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { map, Observable, startWith, tap } from 'rxjs';
import { ComplexFormService } from '../../services/complex-form.service';
import { confirmEqualValidator } from '../../validators/confirm-equal.validator';

@Component({
  selector: 'app-complex-form',
  templateUrl: './complex-form.component.html',
  styleUrls: ['./complex-form.component.scss'],
})
export class ComplexFormComponent implements OnInit {
  loading: boolean = false;

  mainForm!: FormGroup;
  personalInfoForm!: FormGroup;
  contactPreferenceCtrl!: FormControl;
  phoneCtrl!: FormControl;
  emailCtrl!: FormControl;
  confirmEmailCtrl!: FormControl;
  emailForm!: FormGroup;
  passwordCtrl!: FormControl;
  confirmPasswordCtrl!: FormControl;
  loginInfoForm!: FormGroup;

  showEmailCtrl$!: Observable<boolean>;
  showEmailError$!: Observable<boolean>;
  showPhoneCtrl$!: Observable<boolean>;
  showPasswordError$!: Observable<boolean>;

  constructor(
    private formBuilder: FormBuilder,
    private complexFormService: ComplexFormService
  ) {}

  ngOnInit(): void {
    this.initFormControls();
    this.initMainForm();
    this.initFormObservables();
  }

  getFormControlErrorText(ctrl: AbstractControl): string {
    let result: string = 'Ce champ contient une erreur';

    if (ctrl.hasError('required')) {
      result = 'Ce champ est requis';
    } else if (ctrl.hasError('email')) {
      result = "Merci d'entrer une adresse mail valide";
    } else if (ctrl.hasError('minlenght') || ctrl.hasError('maxlenght')) {
      result = "Merci d'entrer un numéro de téléphone valide";
    }

    return result;
  }

  private initFormObservables() {
    this.showEmailCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      startWith(this.contactPreferenceCtrl.value),
      map((preference) => preference === 'email'),
      tap((showEmailCtrl) => {
        if (showEmailCtrl) {
          this.emailCtrl.addValidators([Validators.required, Validators.email]);
          this.confirmEmailCtrl.addValidators([
            Validators.required,
            Validators.email,
          ]);
        } else {
          this.emailCtrl.clearValidators();
          this.confirmEmailCtrl.clearValidators();
        }

        this.emailCtrl.updateValueAndValidity();
        this.confirmEmailCtrl.updateValueAndValidity();
      })
    );

    this.showPhoneCtrl$ = this.contactPreferenceCtrl.valueChanges.pipe(
      startWith(this.contactPreferenceCtrl.value),
      map((preference) => preference === 'phone'),
      tap((showPhoneCtrl) => {
        if (showPhoneCtrl) {
          this.phoneCtrl.addValidators([
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
          ]);
        } else {
          this.phoneCtrl.clearValidators();
        }

        this.phoneCtrl.updateValueAndValidity();
      })
    );

    this.showEmailError$ = this.emailForm.statusChanges.pipe(
      map(
        (status) =>
          status === 'INVALID' &&
          this.emailCtrl.value &&
          this.confirmEmailCtrl.value
      )
    );

    this.showPasswordError$ = this.loginInfoForm.statusChanges.pipe(
      map(
        (status) =>
          status === 'INVALID' &&
          this.passwordCtrl.value &&
          this.confirmPasswordCtrl.value &&
          this.loginInfoForm.hasError('confirmEqual')
      )
    );
  }

  private initFormControls(): void {
    this.personalInfoForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });

    this.contactPreferenceCtrl = this.formBuilder.control('email');
    this.phoneCtrl = this.formBuilder.control('');

    this.emailCtrl = this.formBuilder.control('');
    this.confirmEmailCtrl = this.formBuilder.control('');
    this.emailForm = this.formBuilder.group(
      {
        email: this.emailCtrl,
        confirm: this.confirmEmailCtrl,
      },
      {
        validators: [confirmEqualValidator('email', 'confirm')],
        updateOn: 'blur',
      }
    );

    this.passwordCtrl = this.formBuilder.control('', Validators.required);
    this.confirmPasswordCtrl = this.formBuilder.control(
      '',
      Validators.required
    );
    this.loginInfoForm = this.formBuilder.group(
      {
        username: ['', Validators.required],
        password: this.passwordCtrl,
        confirmPassword: this.confirmPasswordCtrl,
      },
      {
        validators: [confirmEqualValidator('password', 'confirm')],
      }
    );
  }

  private initMainForm(): void {
    this.mainForm = this.formBuilder.group({
      personalInfo: this.personalInfoForm,
      contactPreference: this.contactPreferenceCtrl,
      email: this.emailForm,
      phone: this.phoneCtrl,
      loginInfo: this.loginInfoForm,
    });
  }

  onSubmitForm(): void {
    this.loading = true;
    this.complexFormService
      .saveUserInfo(this.mainForm.value)
      .pipe(
        tap((saved) => {
          this.loading = false;
          if (saved) {
            this.mainForm.reset();
            this.contactPreferenceCtrl.patchValue('email');
          } else {
            console.error("Echec de l'enreigstrement");
          }
        })
      )
      .subscribe();
  }
}
