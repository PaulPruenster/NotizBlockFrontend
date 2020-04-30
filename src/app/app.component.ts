import { Component, OnInit } from '@angular/core';
import { ApiConnectorService } from './api-connector.service';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  user: string;
  pass: string;

  sorts = [
    {v: 't', d: 'Thema'},
    {v: 'd', d: 'Datum'},
    {v: 'tg', d: 'Thema nicht gelesen'},
    {v: 'dg', d: 'Datum nicht gelesen'}
  ];

  reterror: any;
  themen: any;
  benutzer: any;
  notizen: any;
  editnumber: number;

  myForm: FormGroup;
  sortForm: FormGroup;

  constructor(private acs: ApiConnectorService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      ueberschrift: ['', Validators.required],
      text: ['', Validators.required],
      thema: ['', Validators.required]
    });

    this.sortForm = this.fb.group({
      sort: ['t', Validators.required]
    });
  }

  changeSort(e) {
    this.showThemen();
  }

  showThemen() {
    this.themen = null;
    this.reterror = null;
    if (this.user && this.pass) {
      this.acs.getThemen(this.user, this.pass).subscribe(d => this.themen = d, err => this.reterror = err);
      this.acs.getBenutzer(this.user, this.pass).subscribe(d => this.benutzer = d, err => this.reterror = err);
      this.getNotizen();
    }
  }

  getNotizen() {
    if (this.user && this.pass) {
      const sort = this.sortForm.value.sort;
      this.acs.getNotizen(this.user, this.pass, sort).subscribe(d => {
        this.notizen = [];
        d.forEach(e => {
          if (e.benutzer.nummer === this.benutzer.nummer) {
            this.notizen.push(e);
          }
        });
        this.notizen = this.notizen.length === 0 ? null : this.notizen;
      }, e => this.notizen = null);

    }
  }

  addNotiz() {
    if (this.myForm.valid && this.pass && this.user && this.benutzer && this.themen) {
      const send = this.myForm.value;
      send.benutzer = this.benutzer;

      send.nummer = this.editnumber ? this.editnumber : -1;

      this.themen.forEach(t => {
        if (t.nummer === send.thema) {
          send.thema = t;
        }
      });

      console.log(send);

      if (this.editnumber) {
        this.acs.putNotiz(this.user, this.pass, send).subscribe(d => {
          this.getNotizen();
        });
      } else {
        this.acs.postNotiz(this.user, this.pass, send).subscribe(d => {
          this.getNotizen();
        });
      }

      this.editnumber = null;
    }
  }

  deleteNotiz(nummer: number) {
    if (this.user && this.pass && nummer) {
      this.acs.deleteNotiz(this.user, this.pass, nummer).subscribe(d => {
        console.log(d);
        this.getNotizen();
      });
    }
  }

  editNotiz(notiz) {
    this.editnumber = notiz.nummer;

    const obj = {
      ueberschrift: notiz.ueberschrift,
      text: notiz.text,
      thema: notiz.thema.nummer
    };

    this.myForm.setValue(obj);
  }
}
