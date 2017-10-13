import { AfterViewInit, Component, Input, OnInit, ViewEncapsulation, ViewChild, forwardRef, NgZone } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl, NG_VALIDATORS, Validator } from '@angular/forms';

declare var $: any

export const HIJRI_CALENDAR_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ElmDatepickerComponent),
    multi: true
};

export const HIJRI_CALENDAR_VALUE_ACCESSOR_VALIDATION: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => ElmDatepickerComponent),
    multi: true
};

@Component({
    selector: 'ElmDatePicker',
    template: `<div class="row">
    <div class="col-sm-5">
        <select [(ngModel)]="dateType" (change)="onDatetypeChange($event.target.value)" class="form-control">     
        <option value="UmmAlQura">هجري</option>
        <option value="Gregorian">ميلادي</option>
    </select>
    </div>
    <div class="col-sm-7">
        <div class="input-icon">
            <input id="hijri-calendar" pInputText #hc [name]="name" [value]="value" [placeholder]="placeholder" class="form-control datepicker-in"
                [class.input-has-error]="hasError" [style.width.px]="width" type="text" (change)="onDateChange()">
            <i class="fa fa-calendar"></i>
        </div>
    </div>
</div>`,
   // styleUrls: ['\ElmDatePicker.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [HIJRI_CALENDAR_VALUE_ACCESSOR, HIJRI_CALENDAR_VALUE_ACCESSOR_VALIDATION]
})
export class ElmDatepickerComponent implements AfterViewInit, OnInit, Validator {

    private _hijriDatePattern = /^([1-9]|(0|1|2)[0-9]|30)-([1-9]|1[0-2]|0[1-9])-(1[3-4][0-9]{2})$/;
    private _gregorianDatePattern = /^((((0?[1-9]|[12]\d|3[01])[\.\-\/](0?[13578]|1[02])[\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|((0?[1-9]|[12]\d|30)[\.\-\/](0?[13456789]|1[012])[\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|((0?[1-9]|1\d|2[0-8])[\.\-\/]0?2[\.\-\/]((1[6-9]|[2-9]\d)?\d{2}))|(29[\.\-\/]0?2[\.\-\/]((1[6-9]|[2-9]\d)?(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)|00)))|(((0[1-9]|[12]\d|3[01])(0[13578]|1[02])((1[6-9]|[2-9]\d)?\d{2}))|((0[1-9]|[12]\d|30)(0[13456789]|1[012])((1[6-9]|[2-9]\d)?\d{2}))|((0[1-9]|1\d|2[0-8])02((1[6-9]|[2-9]\d)?\d{2}))|(2902((1[6-9]|[2-9]\d)?(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00)|00))))$/;



    @Input() hijriYearRange = "1340:1440";
    @Input() GregorianYearRange = "1900:2050";

    @Input() name;

    @Input() styleClass: string;

    @Input() placeholder: string = "";

    @Input() width: string;

    @Input() hasError = false;

    // Gregorian, UmmAlQura
    @Input() dateType = "";

    value = "";

    onModelChange: Function = () => { };

    onModelTouched: Function = () => { };

    @ViewChild('hc') hc;

    constructor(private zone: NgZone) { }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.initDatepickerControl();
    }

    onDatetypeChange(newValue) {
        $(this.hc.nativeElement).calendarsPicker('clear');
        $(this.hc.nativeElement).calendarsPicker('destroy');
        this.initDatepickerControl();
    }

    initDatepickerControl() {
        var calendarOptions = this.getCalendarOptions();
        $(this.hc.nativeElement).calendarsPicker(calendarOptions);
        
    }

    getCalendarOptions() {
        let yearRange: string = '';
        let lastDay: string = '';
        if (this.dateType == 'Gregorian') {
            yearRange = this.GregorianYearRange;
            lastDay = '31';
        }
        else {
            yearRange = this.hijriYearRange;
            lastDay = '29';
        }

        let [minDate, maxDate] = yearRange.split(':');
        
        return {
            calendar: $.calendars.instance(this.dateType, 'ar'),
            showAnim: 'fadeIn',
            showSpeed: 'fast',
            yearRange: yearRange,
            showOtherMonths: true,
            dateFormat: 'dd-mm-yyyy',
            minDate: `01-01-${minDate}`,
            maxDate: `${lastDay}-12-${maxDate}`,
            alignment: 'bottomRight',
            onSelect: date => {
                this.onModelChange(this.hc.nativeElement.value);
            },
            onClose: date =>{
                this.onModelTouched();
            }
        };
    }

    onDateChange() {
        this.onModelChange(this.hc.nativeElement.value);
    }

    // validates the form, returns null when valid else the validation object
    // in this case we're checking if the json parsing has passed or failed from the onChange method
    public validate(c: FormControl) {
        
        // check if date textbox is empty
        let isEmpty: boolean = true;
        let isValid: boolean = false;

        if (c.value) {
            
            // set isEmpty to False
            isEmpty = false;

            // validate entred date format based on selected date type
            if (this.dateType == "UmmAlQura")
                var regExp = new RegExp(this._hijriDatePattern);
            else
                var regExp = new RegExp(this._gregorianDatePattern);

            isValid = regExp.test(c.value);
        }

        if (isEmpty || !isValid)
            return { empty: isEmpty, valid: isValid };
        return null;
        //return null;
        //return {valid:true};
    }

    writeValue(value: any): void {
        
        this.value = value ? value : "";
    }

    registerOnChange(fn: Function): void {
        this.onModelChange = fn;
    }

    
    registerOnTouched(fn: () => void): void { this.onModelTouched = fn }
}
