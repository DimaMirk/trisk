import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, Subscription, switchMap } from 'rxjs';
import { FormService } from '../../services/form.service';


@Component({
  selector: 'app-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})

export class FormComponent implements OnInit, OnDestroy{

  form: FormGroup;
  private subscription: Subscription = new Subscription();
  showUpdateMessage = false;
  response = null;
  isValuePatched = false;

  constructor(
    private fb: FormBuilder, 
    private cdr: ChangeDetectorRef,
    private  formService:FormService) {
    this.form = this.fb.group({
      textInput: [''],
      radioInput: ['option1'],
      checkboxInput: [false]
    });
    this.cdr.detach();
  }

  ngOnInit(): void {
    this.subscription.add(
      this.form.valueChanges.pipe(
        debounceTime(500),
        switchMap(formData => this.formService.saveData(formData))
      ).subscribe(response => {
        if(!this.isValuePatched){
          console.log()
          this.updateForm(response);
        }
      })
    );
    this.cdr.detectChanges();
  }


  updateForm(data: FormData | null) {
    if (data) {
      this.isValuePatched = true;
      this.form.patchValue(data);

      setTimeout(()=>{
        this.isValuePatched = false
      },1000)

      this.showUpdateMessage = true;
      this.cdr.detectChanges(); 
  
      setTimeout(() => {
        this.showUpdateMessage = false;
        this.cdr.detectChanges();
      }, 3000);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
