import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {
    static timeDiff = {
        minute: 60 * 1000,
        hour: 60 * 60 * 1000,
        day: 24 * 60 * 60 * 1000,
        week: 7 * 24 * 60 * 60 * 1000,
        month: 30 * 24 * 60 * 60 * 1000,
        year: 365 * 24 * 60 * 60 * 1000,
    }

    transform(value: string | Date): any {
        const timeDiff = Date.now() - (new Date(value).getTime());
        let result = 'Il y a ';

        if(timeDiff < TimeAgoPipe.timeDiff.minute) {
            result += 'quelques secondes';
        } else if(timeDiff < TimeAgoPipe.timeDiff.hour) {
            result += 'quelques minutes';
        } else if(timeDiff < TimeAgoPipe.timeDiff.day) {
            result += 'quelques heures';
        } else if(timeDiff < TimeAgoPipe.timeDiff.week) {
            result += 'quelques jours';
        } else if(timeDiff < TimeAgoPipe.timeDiff.month) {
            result += 'quelques semaines';
        } else if(timeDiff < TimeAgoPipe.timeDiff.year) {
            result += 'quelques mois';
        } else {
            result +='plus d\'un an';
        }

        return result;
    }
}