import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { InfoPersona } from '../../../@core/data/models/informacion/info_persona';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-view-info-persona',
  templateUrl: './view-info-persona.component.html',
  styleUrls: ['./view-info-persona.component.scss'],
})
export class ViewInfoPersonaComponent implements OnInit {

  info_persona_id: number;
  info_info_persona: InfoPersona;
  info_persona_user: string;

  @Input('info_persona_id')
  set name(info_persona_id: number) {
    this.info_persona_id = info_persona_id;
    this.loadInfoPersona();
  }

  // tslint:disable-next-line: no-output-rename
  @Output('url_editar') url_editar: EventEmitter<boolean> = new EventEmitter();

  constructor(
    private sanitization: DomSanitizer,
    private translate: TranslateService) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    });
    // this.loadInfoPersona();
  }

  useLanguage(language: string) {
    this.translate.use(language);
  }

  public editar(): void {
    this.url_editar.emit(true);
  }

  public cleanURL(oldURL: string): SafeResourceUrl {
    return this.sanitization.bypassSecurityTrustUrl(oldURL);
  }

  ngOnInit() {
  }

  public loadInfoPersona(): void {
    const id = this.info_persona_id ? this.info_persona_id : this.info_persona_user ? this.info_persona_user : undefined;
    if (id !== undefined && id !== 0 && id.toString() !== '') {
    } else {
      this.info_info_persona = undefined
    }
  }
}
