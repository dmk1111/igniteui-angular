import { Component, OnInit } from '@angular/core';
import { IgxButtonDirective, IgxIconComponent, IgxPageSizeSelectorComponent, IgxPaginatorComponent, IgxPaginatorContentDirective } from 'igniteui-angular';


@Component({
    selector: 'app-pagination',
    styleUrls: ['./pagination.styles.scss'],
    templateUrl: './pagination.template.html',
    standalone: true,
    imports: [IgxPaginatorComponent, IgxPaginatorContentDirective, IgxButtonDirective, IgxPageSizeSelectorComponent, IgxIconComponent]
})
export class PaginationSampleComponent implements OnInit {

    public totalPages: number;
    public totalRecords: number;

    public ngOnInit() {
        this.totalPages = 21;
        this.totalRecords = this.totalPages * 15;
    }

}
