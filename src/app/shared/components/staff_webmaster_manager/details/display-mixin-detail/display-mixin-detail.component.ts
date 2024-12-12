import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {DisplayCompositionI} from "@ingenium/app/shared/models/item/displayCompositionI";

interface FormField {
  name: string
  selector: string
}

@Component({
  selector: 'app-display-mixin-detail',
  templateUrl: './display-mixin-detail.component.html',
  styleUrls: ['./display-mixin-detail.component.css'],
  imports: [
    ReactiveFormsModule,
    NgForOf,
    NgStyle,
    NgIf
  ],
  standalone: true
})
export class DisplayMixinDetailComponent implements OnInit {

  @Input() displayMixin!: DisplayCompositionI;
  @Input() editing: boolean = false;
  @Output() displayUpdate = new EventEmitter<DisplayCompositionI>();
  // @Input() doSumbit https://stackoverflow.com/questions/44053227/how-to-emit-an-event-from-parent-to-child
  form: any;

  formFields: FormField[] = [
    {name: 'Color', selector: 'color'},
    {name: 'Click Link', selector: 'follow_through_link'},
    {name: 'Image Square', selector: 'image_square'},
    {name: 'Image Landscape', selector: 'image_landscape'},
    {name: 'Preview Description', selector: 'preview_description'},
  ];

  form_error: string | null = null;
  loading: boolean = false;

  get f() { return this.form.controls; }

  constructor(private formBuilder: FormBuilder) {
  }
  ngOnInit() {
    this.form = this.formBuilder.group({
      color: [this.displayMixin.color, Validators.required],
      follow_through_link: [this.displayMixin.follow_through_link, Validators.required],
      image_square: [this.displayMixin.image_square],
      image_landscape: [this.displayMixin.image_landscape],
      preview_description: [this.displayMixin.preview_description],
    });

    this.form.valueChanges.subscribe((val: DisplayCompositionI) => {
      // API expects either a valid URL or null for images
      if (val.image_landscape === '') {val.image_landscape = null;}
      if (val.image_square === '') {val.image_square = null; }
      this.displayUpdate.emit(val);
    });
  }

  onSubmit(): void {
    // Check if valid guardclause
    if (this.form.invalid) {
      const error: Error = Error('Wrong email or password');
      this.handleFormError(error);
      return;  }

    this.loading = true;
    // Update de waarden op displayMixin ( Remember, dit is een pointer naar memory )
    // Stuur signaal dat we ze geupdate hebben
    this.loading = false;
  }

  handleFormError(err: Error) {
    this.form_error = err.message;
  }

}
