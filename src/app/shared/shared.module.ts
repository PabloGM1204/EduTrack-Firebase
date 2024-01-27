import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MesaComponent } from './components/mesa/mesa.component';
import { ModalSelectionComponent } from './components/modal-selection/modal-selection.component';
import { AlumnoComponent } from './components/alumno/alumno.component';
import { AlumnoItemComponent } from './components/alumno-item/alumno-item.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { HeaderComponent } from './components/header/header.component';
import { AlumnoDetailComponent } from './components/alumno-detail/alumno-detail.component';
import { AlumnoSelectableComponent } from './components/alumno-selectable/alumno-selectable.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from '../core/translate/translate';
import { HttpClient } from '@angular/common/http';
import { NotasComponent } from './components/notas/notas.component';
import { ModalNotaComponent } from './components/modal-nota/modal-nota.component';
import { ZoomDirective } from './directives/zoom.directive';
import { TruncamientoPipe } from './pipes/truncamiento.pipe';
import { PrimeraLetraMayuscPipe } from './pipes/primera-letra-mayusc.pipe';


@NgModule({
  declarations: [
    // Directivas
    ZoomDirective,
    // Pipes
    PrimeraLetraMayuscPipe,
    // Componentes
    MesaComponent,
    ModalSelectionComponent,
    AlumnoComponent,
    AlumnoItemComponent,
    LoginFormComponent,
    HeaderComponent,
    AlumnoDetailComponent,
    AlumnoSelectableComponent,
    RegisterFormComponent,
    NotasComponent,
    ModalNotaComponent,
    TruncamientoPipe,
    PrimeraLetraMayuscPipe
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    DragDropModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  exports: [
    // Modulos
    CommonModule,
    IonicModule,
    FormsModule,
    DragDropModule,
    TranslateModule,
    // Directivas
    ZoomDirective,
    // Pipes
    PrimeraLetraMayuscPipe,
    // Componentes
    MesaComponent,
    ModalSelectionComponent,
    AlumnoComponent,
    AlumnoItemComponent,
    LoginFormComponent,
    HeaderComponent,
    AlumnoDetailComponent,
    AlumnoSelectableComponent,
    RegisterFormComponent,
    NotasComponent,
    ModalNotaComponent
  ]
})
export class SharedModule { }
