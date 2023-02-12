import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'shorten'
})
export class ShortenPipe implements PipeTransform {
    transform(value: string, maxLength = 50) {
        if(value.length > maxLength) {
            value = value.substring(0, maxLength) + '...';
        }

        return value;
    }
}