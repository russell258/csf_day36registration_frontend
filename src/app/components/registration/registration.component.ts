import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Registration } from 'src/app/models';
import { RegistrationService } from 'src/app/services/registration.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  secret: string = 'this is my secret key'

  fb=inject(FormBuilder);
  registrationSvc = inject(RegistrationService);

  regForm!:FormGroup;
  regStatus="NA";

  sub$!: Subscription;

  ngOnInit():void{
    this.regForm=this.createRegForm();
  }

  ngOnDestroy():void{
    this.sub$.unsubscribe;
  }

  register(){
    const regData: Registration = this.regForm.value as Registration;
    // {name: , email: }
    console.info('>>> RegData: ', regData);

    // this.registrationSvc.registerAsPromise(regData)
    //                     .then(result=> {
    //                       // alert(JSON.stringify(result))
    //                       this.regStatus="success"
    //                       this.regForm.reset()
    //                     })
    //                     .catch(error=>{
    //                       // alert('ERROR! ' +JSON.stringify(error) )
    //                       this.regStatus="failed: "+JSON.stringify(error)
    //                     })

    this.sub$ = this.registrationSvc.registerAsObservable(regData)
                        .subscribe({
                          next: result => {
                            this.regStatus = result
                            this.regForm.reset()
                          },
                          error: error => {this.regStatus="failed: "+JSON.stringify(error)},
                          complete: ()=> {console.info('completed')}
                        })

  }

  private createRegForm(): FormGroup{
    return this.fb.group({
      name: this.fb.control<string>('',[Validators.required,Validators.minLength(3)]),
      email: this.fb.control<string>('',[Validators.required,Validators.email])
    })
  }

}
