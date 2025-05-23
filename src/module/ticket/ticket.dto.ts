import { ArgumentMetadata, Injectable, PipeTransform } from "@nestjs/common";
import { IsNotEmpty } from "class-validator";

export class CreateTicketDTO {
    @IsNotEmpty()
    subject: string;

    @IsNotEmpty()
    message: string;

    @IsNotEmpty()
    category: any;

    priority: any;

    @IsNotEmpty()
    fungsiId: any;

    userOrdererId: string;
}

export class CreateTicketWithoutTicketDTO {
    @IsNotEmpty()
    subject: string;
    from: string;
    @IsNotEmpty()
    body: string;
    receivedTime: string;
}

export class TicketFilterDTO {
    subject: string;
    category: string;
    priority: string;
    fungsi: string;
    status: string;
    offset: number;
    limit: number
}

export class EditTicketDTO {
    @IsNotEmpty()
    expiredAt: Date;

    @IsNotEmpty()
    status: string;
}

export class EditTicketStatusDTO {
    @IsNotEmpty()
    status: string;
}

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        // "value" is an object containing the file's attributes and metadata
        const oneKb = 1000;
        return "value.size < oneKb";
    }
}