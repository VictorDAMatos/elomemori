import { Pipe, PipeTransform } from '@angular/core';
import { Recurrence } from '../../core/models';
import { describeRecurrence, formatPartialDate, formatTimeHuman, timeOfIso } from '../../core/util/dates';
@Pipe({ name: 'memoryDate', standalone: true })
export class MemoryDatePipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    return formatPartialDate(value);
  }
}
@Pipe({ name: 'timeHuman', standalone: true })
export class TimeHumanPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    return value ? formatTimeHuman(value) : '';
  }
}
@Pipe({ name: 'recurrence', standalone: true })
export class RecurrencePipe implements PipeTransform {
  transform(value: Recurrence | undefined | null): string {
    return value ? describeRecurrence(value) : '';
  }
}
@Pipe({ name: 'logTime', standalone: true })
export class LogTimePipe implements PipeTransform {
  transform(iso: string | undefined | null): string {
    if (!iso) return '';
    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    const time = formatTimeHuman(timeOfIso(iso));
    return m ? `${m[3]}/${m[2]} às ${time}` : time;
  }
}
