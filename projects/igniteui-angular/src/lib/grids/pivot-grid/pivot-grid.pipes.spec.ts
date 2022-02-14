import { NoopPivotDimensionsStrategy } from '../../data-operations/pivot-strategy';
import { configureTestSuite } from '../../test-utils/configure-suite';
import { IgxNumberSummaryOperand } from '../summaries/grid-summary';
import { IgxPivotDateDimension } from './pivot-grid-dimensions';
import { IgxPivotNumericAggregate } from './pivot-grid-aggregate';
import { IPivotConfiguration } from './pivot-grid.interface';
import { IgxPivotColumnPipe, IgxPivotRowExpansionPipe, IgxPivotRowPipe } from './pivot-grid.pipes';
import { PivotGridFunctions } from '../../test-utils/pivot-grid-functions.spec';
import { DATA } from 'src/app/shared/pivot-data';

describe('Pivot pipes #pivotGrid', () => {
    let rowPipe: IgxPivotRowPipe;
    let rowStatePipe: IgxPivotRowExpansionPipe;
    let columnPipe: IgxPivotColumnPipe;
    let expansionStates: Map<any, boolean>;
    let data: any[];
    let pivotConfig: IPivotConfiguration;

    configureTestSuite();
    beforeEach(() => {
        data = [
            {
                ProductCategory: 'Clothing', UnitPrice: 12.81, SellerName: 'Stanley',
                Country: 'Bulgaria', Date: '01/01/2021', UnitsSold: 282
            },
            { ProductCategory: 'Clothing', UnitPrice: 49.57, SellerName: 'Elisa', Country: 'USA', Date: '01/05/2019', UnitsSold: 296 },
            { ProductCategory: 'Bikes', UnitPrice: 3.56, SellerName: 'Lydia', Country: 'Uruguay', Date: '01/06/2020', UnitsSold: 68 },
            { ProductCategory: 'Accessories', UnitPrice: 85.58, SellerName: 'David', Country: 'USA', Date: '04/07/2021', UnitsSold: 293 },
            { ProductCategory: 'Components', UnitPrice: 18.13, SellerName: 'John', Country: 'USA', Date: '12/08/2021', UnitsSold: 240 },
            { ProductCategory: 'Clothing', UnitPrice: 68.33, SellerName: 'Larry', Country: 'Uruguay', Date: '05/12/2020', UnitsSold: 456 },
            {
                ProductCategory: 'Clothing', UnitPrice: 16.05, SellerName: 'Walter',
                Country: 'Bulgaria', Date: '02/19/2020', UnitsSold: 492
            }];
        pivotConfig = {
            columns: [{
                memberName: 'All',
                memberFunction: () => 'All',
                enabled: true,
                childLevel: {
                    memberName: 'Country',
                    enabled: true
                }
            }],
            rows: [{
                memberName: 'AllCategory',
                memberFunction: () => 'All',
                enabled: true,
                childLevel: {
                    memberName: 'ProductCategory',
                    memberFunction: (d) => d.ProductCategory,
                    enabled: true
                }
            }],
            values: [
                {
                    member: 'UnitsSold',
                    aggregate: {
                        aggregator: IgxPivotNumericAggregate.sum,
                        key: 'sum',
                        label: 'Sum'
                    },
                    enabled: true
                }
            ],
            filters: null
        };
        expansionStates = new Map<any, boolean>();
        rowPipe = new IgxPivotRowPipe();
        rowStatePipe = new IgxPivotRowExpansionPipe();
        columnPipe = new IgxPivotColumnPipe();
    });

    it('transforms flat data to pivot data', () => {
        const rowPipeResult = rowPipe.transform(data, pivotConfig, expansionStates);
        const columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, expansionStates);
        const rowStatePipeResult = rowStatePipe.transform(columnPipeResult, pivotConfig, expansionStates, true);
        expect(rowStatePipeResult).toEqual([
            { All: 2127, 'All-Bulgaria': 774, 'All-USA': 829, 'All-Uruguay': 524, AllCategory: 'All', AllCategory_level: 0 },
            { ProductCategory: 'Clothing', All: 1526, 'All-Bulgaria': 774, 'All-USA': 296, 'All-Uruguay': 456, ProductCategory_level: 1 },
            {
                ProductCategory: 'Bikes', All: 68, 'All-Uruguay': 68, ProductCategory_level: 1, UnitPrice: 3.56, SellerName: 'Lydia', Country: 'Uruguay',
                Date: '01/06/2020', UnitsSold: 68
            },
            {
                ProductCategory: 'Accessories', All: 293, 'All-USA': 293, ProductCategory_level: 1, UnitPrice: 85.58, SellerName: 'David', Country: 'USA',
                Date: '04/07/2021', UnitsSold: 293
            },
            {
                ProductCategory: 'Components', All: 240, 'All-USA': 240, ProductCategory_level: 1, UnitPrice: 18.13, SellerName: 'John', Country: 'USA',
                Date: '12/08/2021', UnitsSold: 240
            }
        ]);
    });

    it('transforms flat data to pivot data single row dimension and no children are defined', () => {
        pivotConfig.rows = [{
            memberName: 'ProductCategory',
            enabled: true
        }];
        const rowPipeResult = rowPipe.transform(data, pivotConfig, expansionStates);
        expect(rowPipeResult).toEqual([
            {
                ProductCategory: 'Clothing', records: [
                    {
                        ProductCategory: 'Clothing', UnitPrice: 12.81, SellerName: 'Stanley',
                        Country: 'Bulgaria', Date: '01/01/2021', UnitsSold: 282
                    },
                    {
                        ProductCategory: 'Clothing', UnitPrice: 49.57, SellerName: 'Elisa',
                        Country: 'USA', Date: '01/05/2019', UnitsSold: 296
                    },
                    {
                        ProductCategory: 'Clothing', UnitPrice: 68.33, SellerName: 'Larry',
                        Country: 'Uruguay', Date: '05/12/2020', UnitsSold: 456
                    },
                    {
                        ProductCategory: 'Clothing', UnitPrice: 16.05, SellerName: 'Walter',
                        Country: 'Bulgaria', Date: '02/19/2020', UnitsSold: 492
                    }],
                ProductCategory_records: [
                    {
                        ProductCategory: 'Clothing', UnitPrice: 12.81, SellerName: 'Stanley',
                        Country: 'Bulgaria', Date: '01/01/2021', UnitsSold: 282
                    },
                    {
                        ProductCategory: 'Clothing', UnitPrice: 49.57, SellerName: 'Elisa',
                        Country: 'USA', Date: '01/05/2019', UnitsSold: 296
                    },
                    {
                        ProductCategory: 'Clothing', UnitPrice: 68.33, SellerName: 'Larry',
                        Country: 'Uruguay', Date: '05/12/2020', UnitsSold: 456
                    },
                    {
                        ProductCategory: 'Clothing', UnitPrice: 16.05, SellerName: 'Walter',
                        Country: 'Bulgaria', Date: '02/19/2020', UnitsSold: 492
                    }
                ], level: 0
            },
            {
                ProductCategory: 'Bikes', records: [
                    {
                        ProductCategory: 'Bikes', UnitPrice: 3.56, SellerName: 'Lydia',
                        Country: 'Uruguay', Date: '01/06/2020', UnitsSold: 68
                    }
                ], ProductCategory_records: [
                    {
                        ProductCategory: 'Bikes', UnitPrice: 3.56, SellerName: 'Lydia',
                        Country: 'Uruguay', Date: '01/06/2020', UnitsSold: 68
                    }
                ], level: 0
            },
            {
                ProductCategory: 'Accessories', records: [
                    {
                        ProductCategory: 'Accessories', UnitPrice: 85.58, SellerName: 'David',
                        Country: 'USA', Date: '04/07/2021', UnitsSold: 293
                    }
                ], ProductCategory_records: [
                    {
                        ProductCategory: 'Accessories', UnitPrice: 85.58, SellerName: 'David',
                        Country: 'USA', Date: '04/07/2021', UnitsSold: 293
                    }
                ], level: 0
            },
            {
                ProductCategory: 'Components', records: [
                    {
                        ProductCategory: 'Components', UnitPrice: 18.13, SellerName: 'John',
                        Country: 'USA', Date: '12/08/2021', UnitsSold: 240
                    }
                ], ProductCategory_records: [
                    {
                        ProductCategory: 'Components', UnitPrice: 18.13, SellerName: 'John',
                        Country: 'USA', Date: '12/08/2021', UnitsSold: 240
                    }
                ], level: 0
            }]);
        const columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, expansionStates);
        const rowStatePipeResult = rowStatePipe.transform(columnPipeResult, pivotConfig, expansionStates, true);
        expect(rowStatePipeResult).toEqual([
            {
                ProductCategory: 'Clothing', All: 1526, 'All-Bulgaria': 774, 'All-USA': 296,
                'All-Uruguay': 456, ProductCategory_level: 0
            },
            { ProductCategory: 'Bikes', All: 68, 'All-Uruguay': 68, ProductCategory_level: 0 },
            { ProductCategory: 'Accessories', All: 293, 'All-USA': 293, ProductCategory_level: 0 },
            { ProductCategory: 'Components', All: 240, 'All-USA': 240, ProductCategory_level: 0 }
        ]);
    });

    it('allows setting expand/collapse state.', () => {
        const expanded = new Map<any, boolean>();
        expanded.set('All', false);
        const rowPipeResult = rowPipe.transform(data, pivotConfig, expanded);
        const columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, expansionStates);
        const rowPipeCollapseResult = rowStatePipe.transform(columnPipeResult, pivotConfig, expanded, true);
        expect(rowPipeCollapseResult).toEqual([
            {
                AllCategory: 'All',
                AllCategory_level: 0,
                All: 2127,
                'All-Bulgaria': 774,
                'All-USA': 829,
                'All-Uruguay': 524
            }
        ]);

        expanded.set('All', true);
        const rowPipeExpandResult = rowStatePipe.transform(columnPipeResult, pivotConfig, expanded, true);
        expect(rowPipeExpandResult).toEqual([
            { AllCategory: 'All', All: 2127, 'All-Bulgaria': 774, 'All-USA': 829, 'All-Uruguay': 524, AllCategory_level: 0 },
            { ProductCategory: 'Clothing', All: 1526, 'All-Bulgaria': 774, 'All-USA': 296, 'All-Uruguay': 456, ProductCategory_level: 1 },
            {
                ProductCategory: 'Bikes', All: 68, 'All-Uruguay': 68, ProductCategory_level: 1, UnitPrice: 3.56, SellerName: 'Lydia', Country: 'Uruguay',
                Date: '01/06/2020', UnitsSold: 68
            },
            {
                ProductCategory: 'Accessories', All: 293, 'All-USA': 293, ProductCategory_level: 1, UnitPrice: 85.58, SellerName: 'David', Country: 'USA',
                Date: '04/07/2021', UnitsSold: 293
            },
            {
                ProductCategory: 'Components', All: 240, 'All-USA': 240, ProductCategory_level: 1, UnitPrice: 18.13, SellerName: 'John', Country: 'USA',
                Date: '12/08/2021', UnitsSold: 240
            }]);
    });

    it('transforms flat data to pivot data multiple row dimensions', () => {
        pivotConfig.rows = [
            {
                memberName: 'ProductCategory',
                enabled: true
            },
            {
                memberName: 'Date',
                enabled: true
            }
        ];
        const rowPipeResult = rowPipe.transform(data, pivotConfig, expansionStates);
        const columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, expansionStates);
        const rowStatePipeResult = rowStatePipe.transform(columnPipeResult, pivotConfig, expansionStates, true);
        expect(rowStatePipeResult).toEqual([
            { Date: '01/01/2021', ProductCategory: 'Clothing', All: 282, 'All-Bulgaria': 282, ProductCategory_level: 0, Date_level: 0 },
            { Date: '01/05/2019', ProductCategory: 'Clothing', All: 296, 'All-USA': 296, ProductCategory_level: 0, Date_level: 0 },
            { Date: '05/12/2020', ProductCategory: 'Clothing', All: 456, 'All-Uruguay': 456, ProductCategory_level: 0, Date_level: 0 },
            { Date: '02/19/2020', ProductCategory: 'Clothing', All: 492, 'All-Bulgaria': 492, ProductCategory_level: 0, Date_level: 0 },
            { Date: '01/06/2020', ProductCategory: 'Bikes', All: 68, 'All-Uruguay': 68, ProductCategory_level: 0, Date_level: 0 },
            { Date: '04/07/2021', ProductCategory: 'Accessories', All: 293, 'All-USA': 293, ProductCategory_level: 0, Date_level: 0 },
            { Date: '12/08/2021', ProductCategory: 'Components', All: 240, 'All-USA': 240, ProductCategory_level: 0, Date_level: 0 }]);
    });

    it('transforms flat data to pivot data with multiple nested row dimensions', () => {
        pivotConfig.rows = [{
            memberName: 'AllProd',
            memberFunction: () => 'AllProd',
            enabled: true,
            childLevel: {
                memberName: 'ProductCategory',
                enabled: true
            }
        },
        {
            memberName: 'AllDate',
            memberFunction: () => 'AllDate',
            enabled: true,
            childLevel: {
                memberName: 'Date',
                enabled: true
            }
        }];
        const rowPipeResult = rowPipe.transform(data, pivotConfig, expansionStates);
        const columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, expansionStates);
        const rowStatePipeResult = rowStatePipe.transform(columnPipeResult, pivotConfig, expansionStates, true);
        expect(rowStatePipeResult).toEqual([
            {
                'AllDate': 'AllDate', 'AllProd': 'AllProd', 'All': 2127, 'All-Bulgaria': 774, 'All-USA': 829, 'All-Uruguay': 524, 'AllProd_level': 0,
                'AllDate_level': 0
            },
            {
                'Date': '01/01/2021', 'ProductCategory': 'Clothing', 'UnitPrice': 12.81, 'SellerName': 'Stanley', 'Country': 'Bulgaria',
                'UnitsSold': 282, 'AllProd': 'AllProd', 'All': 282, 'All-Bulgaria': 282, 'Date_level': 1, 'AllProd_level': 0
            },
            {
                'Date': '01/05/2019', 'ProductCategory': 'Clothing', 'UnitPrice': 49.57, 'SellerName': 'Elisa', 'Country': 'USA',
                'UnitsSold': 296, 'AllProd': 'AllProd', 'All': 296, 'All-USA': 296, 'Date_level': 1, 'AllProd_level': 0
            },
            {
                'Date': '05/12/2020', 'ProductCategory': 'Clothing', 'UnitPrice': 68.33, 'SellerName': 'Larry', 'Country': 'Uruguay',
                'UnitsSold': 456, 'AllProd': 'AllProd', 'All': 456, 'All-Uruguay': 456, 'Date_level': 1, 'AllProd_level': 0
            },
            {
                'Date': '02/19/2020', 'ProductCategory': 'Clothing', 'UnitPrice': 16.05, 'SellerName': 'Walter', 'Country': 'Bulgaria',
                'UnitsSold': 492, 'AllProd': 'AllProd', 'All': 492, 'All-Bulgaria': 492, 'Date_level': 1, 'AllProd_level': 0
            },
            {
                'Date': '01/06/2020', 'ProductCategory': 'Bikes', 'UnitPrice': 3.56, 'SellerName': 'Lydia', 'Country': 'Uruguay',
                'UnitsSold': 68, 'AllProd': 'AllProd', 'All': 68, 'All-Uruguay': 68, 'Date_level': 1, 'AllProd_level': 0
            },
            {
                'Date': '04/07/2021', 'ProductCategory': 'Accessories', 'UnitPrice': 85.58, 'SellerName': 'David', 'Country': 'USA',
                'UnitsSold': 293, 'AllProd': 'AllProd', 'All': 293, 'All-USA': 293, 'Date_level': 1, 'AllProd_level': 0
            },
            {
                'Date': '12/08/2021', 'ProductCategory': 'Components', 'UnitPrice': 18.13, 'SellerName': 'John', 'Country': 'USA',
                'UnitsSold': 240, 'AllProd': 'AllProd', 'All': 240, 'All-USA': 240, 'Date_level': 1, 'AllProd_level': 0
            },
            {
                'ProductCategory': 'Clothing', 'AllDate': 'AllDate', 'All': 1526, 'All-Bulgaria': 774, 'All-USA': 296,
                'All-Uruguay': 456, 'ProductCategory_level': 1, 'AllDate_level': 0
            },
            {
                'Date': '01/01/2021',
                'ProductCategory': 'Clothing', 'UnitPrice': 12.81, 'SellerName': 'Stanley', 'Country': 'Bulgaria',
                'UnitsSold': 282, 'All': 282, 'All-Bulgaria': 282, 'Date_level': 1, 'ProductCategory_level': 1
            },
            {
                'Date': '01/05/2019', 'ProductCategory': 'Clothing', 'UnitPrice': 49.57, 'SellerName': 'Elisa',
                'Country': 'USA', 'UnitsSold': 296, 'All': 296, 'All-USA': 296, 'Date_level': 1, 'ProductCategory_level': 1
            },
            {
                'Date': '05/12/2020', 'ProductCategory': 'Clothing', 'UnitPrice': 68.33, 'SellerName': 'Larry', 'Country': 'Uruguay',
                'UnitsSold': 456, 'All': 456, 'All-Uruguay': 456, 'Date_level': 1, 'ProductCategory_level': 1
            },
            {
                'Date': '02/19/2020', 'ProductCategory': 'Clothing', 'UnitPrice': 16.05, 'SellerName': 'Walter',
                'Country': 'Bulgaria', 'UnitsSold': 492, 'All': 492, 'All-Bulgaria': 492, 'Date_level': 1,
                'ProductCategory_level': 1
            }, {
                'ProductCategory': 'Bikes', 'UnitPrice': 3.56, 'SellerName': 'Lydia',
                'Country': 'Uruguay', 'Date': '01/06/2020', 'UnitsSold': 68, 'AllDate': 'AllDate', 'All': 68,
                'All-Uruguay': 68, 'ProductCategory_level': 1, 'AllDate_level': 0
            },
            {
                'Date': '01/06/2020', 'ProductCategory': 'Bikes', 'UnitPrice': 3.56, 'SellerName': 'Lydia',
                'Country': 'Uruguay', 'UnitsSold': 68, 'All': 68, 'All-Uruguay': 68, 'Date_level': 1, 'ProductCategory_level': 1
            },
            {
                'ProductCategory': 'Accessories', 'UnitPrice': 85.58, 'SellerName': 'David', 'Country': 'USA', 'Date': '04/07/2021', 'UnitsSold': 293,
                'AllDate': 'AllDate', 'All': 293, 'All-USA': 293, 'ProductCategory_level': 1, 'AllDate_level': 0
            },
            {
                'Date': '04/07/2021', 'ProductCategory': 'Accessories', 'UnitPrice': 85.58, 'SellerName': 'David', 'Country': 'USA', 'UnitsSold': 293,
                'All': 293, 'All-USA': 293, 'Date_level': 1, 'ProductCategory_level': 1
            },
            {
                'ProductCategory': 'Components', 'UnitPrice': 18.13,
                'SellerName': 'John', 'Country': 'USA', 'Date': '12/08/2021', 'UnitsSold': 240, 'AllDate': 'AllDate', 'All': 240, 'All-USA': 240,
                'ProductCategory_level': 1, 'AllDate_level': 0
            },
            {
                'Date': '12/08/2021', 'ProductCategory': 'Components',
                'UnitPrice': 18.13, 'SellerName': 'John', 'Country': 'USA', 'UnitsSold': 240, 'All': 240, 'All-USA': 240, 'Date_level': 1,
                'ProductCategory_level': 1
            }]);
    });

    it('transforms flat data to pivot data 2 column dimensions', () => {
        pivotConfig.columns = [{
            memberName: 'Country',
            enabled: true
        },
        {
            memberName: 'Date',
            enabled: true
        }];
        const rowPipeResult = rowPipe.transform(data, pivotConfig, new Map<any, boolean>());
        const columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, new Map<any, boolean>());
        const rowStatePipeResult = rowStatePipe.transform(columnPipeResult, pivotConfig, new Map<any, boolean>(), true);
        /* eslint-disable quote-props */
        expect(rowStatePipeResult).toEqual([
            {
                'AllCategory': 'All', 'Bulgaria': 774, 'Bulgaria-01/01/2021': 282, 'Bulgaria-02/19/2020': 492, 'USA': 829, 'USA-01/05/2019': 296,
                'USA-04/07/2021': 293, 'USA-12/08/2021': 240, 'Uruguay': 524, 'Uruguay-05/12/2020': 456, 'Uruguay-01/06/2020': 68, 'AllCategory_level': 0
            },
            {
                'ProductCategory': 'Clothing', 'Bulgaria': 774, 'Bulgaria-01/01/2021': 282, 'Bulgaria-02/19/2020': 492, 'USA': 296, 'USA-01/05/2019': 296,
                'Uruguay': 456, 'Uruguay-05/12/2020': 456, 'ProductCategory_level': 1
            },
            {
                'ProductCategory': 'Bikes', 'UnitPrice': 3.56, 'SellerName': 'Lydia', 'Country': 'Uruguay', 'Date': '01/06/2020', 'UnitsSold': 68, 'Uruguay': 68,
                'Uruguay-01/06/2020': 68, 'ProductCategory_level': 1
            },
            {
                'ProductCategory': 'Accessories', 'UnitPrice': 85.58, 'SellerName': 'David', 'Country': 'USA', 'Date': '04/07/2021', 'UnitsSold': 293,
                'USA': 293, 'USA-04/07/2021': 293, 'ProductCategory_level': 1
            },
            {
                'ProductCategory': 'Components', 'UnitPrice': 18.13, 'SellerName': 'John', 'Country': 'USA', 'Date': '12/08/2021', 'UnitsSold': 240,
                'USA': 240, 'USA-12/08/2021': 240, 'ProductCategory_level': 1
            }
        ]);
    });

    it('transforms flat data to pivot data 3 column dimensions', () => {
        pivotConfig.columns = [{
            memberName: 'Country',
            enabled: true
        },
        {
            memberName: 'SellerName',
            enabled: true
        },
        {
            memberName: 'Date',
            enabled: true
        }];
        const rowPipeResult = rowPipe.transform(data, pivotConfig, new Map<any, boolean>());
        const columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, new Map<any, boolean>());
        const rowStateResult = rowStatePipe.transform(columnPipeResult, pivotConfig, new Map<any, boolean>(), true);
        /* eslint-disable quote-props */
        expect(rowStateResult).toEqual(
            [
                {
                    'AllCategory': 'All', 'Bulgaria': 774, 'Bulgaria-Stanley': 282, 'Bulgaria-Stanley-01/01/2021': 282, 'Bulgaria-Walter': 492,
                    'Bulgaria-Walter-02/19/2020': 492, 'USA': 829, 'USA-Elisa': 296, 'USA-Elisa-01/05/2019': 296, 'USA-David': 293,
                    'USA-David-04/07/2021': 293, 'USA-John': 240, 'USA-John-12/08/2021': 240, 'Uruguay': 524, 'Uruguay-Larry': 456,
                    'Uruguay-Larry-05/12/2020': 456, 'Uruguay-Lydia': 68, 'Uruguay-Lydia-01/06/2020': 68, 'AllCategory_level': 0
                },
                {
                    'ProductCategory': 'Clothing', 'Bulgaria': 774, 'Bulgaria-Stanley': 282, 'Bulgaria-Stanley-01/01/2021': 282,
                    'Bulgaria-Walter': 492, 'Bulgaria-Walter-02/19/2020': 492, 'USA': 296, 'USA-Elisa': 296, 'USA-Elisa-01/05/2019': 296,
                    'Uruguay': 456, 'Uruguay-Larry': 456, 'Uruguay-Larry-05/12/2020': 456, 'ProductCategory_level': 1
                },
                {
                    'ProductCategory': 'Bikes', 'UnitPrice': 3.56, 'SellerName': 'Lydia', 'Country': 'Uruguay', 'Date': '01/06/2020',
                    'UnitsSold': 68, 'Uruguay': 68, 'Uruguay-Lydia': 68, 'Uruguay-Lydia-01/06/2020': 68, 'ProductCategory_level': 1
                },
                {
                    'ProductCategory': 'Accessories', 'UnitPrice': 85.58, 'SellerName': 'David', 'Country': 'USA', 'Date': '04/07/2021',
                    'UnitsSold': 293, 'USA': 293, 'USA-David': 293, 'USA-David-04/07/2021': 293, 'ProductCategory_level': 1
                },
                {
                    'ProductCategory': 'Components', 'UnitPrice': 18.13, 'SellerName': 'John', 'Country': 'USA', 'Date': '12/08/2021',
                    'UnitsSold': 240, 'USA': 240, 'USA-John': 240, 'USA-John-12/08/2021': 240, 'ProductCategory_level': 1
                }
            ]
        );
    });

    it('transforms flat data to pivot data 2 value dimensions', () => {
        pivotConfig.values = [
            {
                member: 'UnitsSold',
                aggregate: {
                    aggregator: IgxPivotNumericAggregate.sum,
                    key: 'sum',
                    label: 'SUM',
                },
                enabled: true
            },
            {
                member: 'UnitPrice',
                aggregate: {
                    aggregator: IgxPivotNumericAggregate.sum,
                    key: 'sum',
                    label: 'SUM',
                },
                enabled: true
            }
        ];
        const rowPipeResult = rowPipe.transform(data, pivotConfig, expansionStates);
        const columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, expansionStates);
        const rowStatePipeResult = rowStatePipe.transform(columnPipeResult, pivotConfig, new Map<any, boolean>(), true);
        expect(rowStatePipeResult).toEqual(
            [
                {
                    'AllCategory': 'All', 'All-UnitsSold': 2127, 'All-Bulgaria-UnitsSold': 774, 'All-Bulgaria-UnitPrice': 28.86, 'All-USA-UnitsSold': 829,
                    'All-USA-UnitPrice': 153.28, 'All-Uruguay-UnitsSold': 524, 'All-Uruguay-UnitPrice': 71.89, 'All-UnitPrice': 254.02999999999997,
                    'AllCategory_level': 0
                },
                {
                    'ProductCategory': 'Clothing', 'All-UnitsSold': 1526, 'All-Bulgaria-UnitsSold': 774, 'All-Bulgaria-UnitPrice': 28.86,
                    'All-USA-UnitsSold': 296, 'All-USA-UnitPrice': 49.57, 'All-Uruguay-UnitsSold': 456, 'All-Uruguay-UnitPrice': 68.33,
                    'All-UnitPrice': 146.76, 'ProductCategory_level': 1
                },
                {
                    'ProductCategory': 'Bikes', 'UnitPrice': 3.56, 'SellerName': 'Lydia',
                    'Country': 'Uruguay', 'Date': '01/06/2020', 'UnitsSold': 68, 'All-UnitsSold': 68, 'All-Uruguay-UnitsSold': 68,
                    'All-Uruguay-UnitPrice': 3.56, 'All-UnitPrice': 3.56, 'ProductCategory_level': 1
                },
                {
                    'ProductCategory': 'Accessories', 'UnitPrice': 85.58, 'SellerName': 'David', 'Country': 'USA', 'Date': '04/07/2021',
                    'UnitsSold': 293, 'All-UnitsSold': 293, 'All-USA-UnitsSold': 293, 'All-USA-UnitPrice': 85.58, 'All-UnitPrice': 85.58,
                    'ProductCategory_level': 1
                },
                {
                    'ProductCategory': 'Components', 'UnitPrice': 18.13, 'SellerName': 'John', 'Country': 'USA', 'Date': '12/08/2021',
                    'UnitsSold': 240, 'All-UnitsSold': 240, 'All-USA-UnitsSold': 240, 'All-USA-UnitPrice': 18.13, 'All-UnitPrice': 18.13,
                    'ProductCategory_level': 1
                }
            ]
        );
    });

    it('allow setting NoopPivotDimensionsStrategy for rows/columns', () => {
        const preprocessedData = [
            {
                All: 2127, AllCategory: 'All', AllCategory_records: [
                    { ProductCategory: 'Clothing', All: 1526, 'All-Bulgaria': 774, 'All-USA': 296, 'All-Uruguay': 456 },
                    { ProductCategory: 'Bikes', All: 68, 'All-Uruguay': 68 },
                    { ProductCategory: 'Accessories', All: 293, 'All-USA': 293 },
                    { ProductCategory: 'Components', All: 240, 'All-USA': 240 }]
                , 'All-Bulgaria': 774, 'All-USA': 829, 'All-Uruguay': 524
            }];
        pivotConfig.columnStrategy = NoopPivotDimensionsStrategy.instance();
        pivotConfig.columns[0].memberName = 'All';
        pivotConfig.rowStrategy = NoopPivotDimensionsStrategy.instance();
        pivotConfig.rows[0].memberName = 'AllCategory';

        const rowPipeResult = rowPipe.transform(preprocessedData, pivotConfig, new Map<any, boolean>());
        const columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, new Map<any, boolean>());
        const rowStateResult = rowStatePipe.transform(columnPipeResult, pivotConfig, new Map<any, boolean>(), true);

        // same data but expanded
        expect(rowStateResult).toEqual(
            [
                {
                    'All': 2127, 'AllCategory': 'All', 'All-Bulgaria': 774, 'All-USA': 829,
                    'All-Uruguay': 524, 'AllCategory_level': 0
                },
                {
                    'ProductCategory': 'Clothing', 'All': 1526, 'All-Bulgaria': 774,
                    'All-USA': 296, 'All-Uruguay': 456, 'ProductCategory_level': 1
                },
                { 'ProductCategory': 'Bikes', 'All': 68, 'All-Uruguay': 68, 'ProductCategory_level': 1 },
                { 'ProductCategory': 'Accessories', 'All': 293, 'All-USA': 293, 'ProductCategory_level': 1 },
                { 'ProductCategory': 'Components', 'All': 240, 'All-USA': 240, 'ProductCategory_level': 1 }]
        );
    });

    it('should generate correct levels when using predefined date dimension', () => {
        data = [
            {
                ProductCategory: 'Clothing', UnitPrice: 12.81, SellerName: 'Stanley',
                Country: 'Bulgaria', City: 'Sofia', Date: '01/01/2021', UnitsSold: 282
            },
            {
                ProductCategory: 'Clothing', UnitPrice: 49.57, SellerName: 'Elisa',
                Country: 'USA', City: 'New York', Date: '01/05/2019', UnitsSold: 296
            },
            {
                ProductCategory: 'Bikes', UnitPrice: 3.56, SellerName: 'Lydia',
                Country: 'Uruguay', City: 'Ciudad de la Costa', Date: '01/06/2020', UnitsSold: 68
            },
            {
                ProductCategory: 'Accessories', UnitPrice: 85.58, SellerName: 'David',
                Country: 'USA', City: 'New York', Date: '04/07/2021', UnitsSold: 293
            },
            {
                ProductCategory: 'Components', UnitPrice: 18.13, SellerName: 'John',
                Country: 'USA', City: 'New York', Date: '12/08/2021', UnitsSold: 240
            },
            {
                ProductCategory: 'Clothing', UnitPrice: 68.33, SellerName: 'Larry',
                Country: 'Uruguay', City: 'Ciudad de la Costa', Date: '05/12/2020', UnitsSold: 456
            },
            {
                ProductCategory: 'Clothing', UnitPrice: 16.05, SellerName: 'Walter',
                Country: 'Bulgaria', City: 'Plovdiv', Date: '02/19/2020', UnitsSold: 492
            }];

        pivotConfig.rows = [
            new IgxPivotDateDimension(
                {
                    memberName: 'Date',
                    enabled: true
                },
                {
                    months: false
                }
            )
        ];

        const rowPipeResult = rowPipe.transform(data, pivotConfig, expansionStates);

        expect(rowPipeResult[0]).toEqual(
            {
                'AllPeriods': 'All Periods', 'AllPeriods_records': [
                    {
                        'Years': '2021', 'records': [
                            {
                                'ProductCategory': 'Clothing', 'UnitPrice': 12.81, 'SellerName': 'Stanley', 'Country': 'Bulgaria', 'City': 'Sofia',
                                'Date': '01/01/2021', 'UnitsSold': 282
                            },
                            {
                                'ProductCategory': 'Accessories', 'UnitPrice': 85.58, 'SellerName': 'David', 'Country': 'USA', 'City': 'New York',
                                'Date': '04/07/2021', 'UnitsSold': 293
                            }, {
                                'ProductCategory': 'Components', 'UnitPrice': 18.13, 'SellerName': 'John',
                                'Country': 'USA', 'City': 'New York', 'Date': '12/08/2021', 'UnitsSold': 240
                            }
                        ], 'Years_records': [
                            {
                                'Date': '01/01/2021', 'records': [
                                    {
                                        'ProductCategory': 'Clothing', 'UnitPrice': 12.81, 'SellerName': 'Stanley', 'Country': 'Bulgaria', 'City': 'Sofia',
                                        'Date': '01/01/2021', 'UnitsSold': 282
                                    }], 'Date_records': [{
                                        'ProductCategory': 'Clothing', 'UnitPrice': 12.81,
                                        'SellerName': 'Stanley', 'Country': 'Bulgaria', 'City': 'Sofia', 'Date': '01/01/2021', 'UnitsSold': 282
                                    }
                                    ], 'level': 2, 'ProductCategory': 'Clothing', 'UnitPrice': 12.81, 'SellerName': 'Stanley',
                                'Country': 'Bulgaria', 'City': 'Sofia', 'UnitsSold': 282
                            },
                            {
                                'Date': '04/07/2021', 'records': [
                                    {
                                        'ProductCategory': 'Accessories', 'UnitPrice': 85.58, 'SellerName': 'David', 'Country': 'USA', 'City': 'New York',
                                        'Date': '04/07/2021', 'UnitsSold': 293
                                    }
                                ], 'Date_records': [
                                    {
                                        'ProductCategory': 'Accessories', 'UnitPrice': 85.58, 'SellerName': 'David', 'Country': 'USA',
                                        'City': 'New York', 'Date': '04/07/2021', 'UnitsSold': 293
                                    }
                                ], 'level': 2, 'ProductCategory': 'Accessories', 'UnitPrice': 85.58, 'SellerName': 'David', 'Country': 'USA',
                                'City': 'New York', 'UnitsSold': 293
                            },
                            {
                                'Date': '12/08/2021', 'records': [
                                    {
                                        'ProductCategory': 'Components', 'UnitPrice': 18.13, 'SellerName': 'John', 'Country': 'USA',
                                        'City': 'New York', 'Date': '12/08/2021', 'UnitsSold': 240
                                    }
                                ], 'Date_records': [
                                    {
                                        'ProductCategory': 'Components', 'UnitPrice': 18.13, 'SellerName': 'John', 'Country': 'USA',
                                        'City': 'New York', 'Date': '12/08/2021', 'UnitsSold': 240
                                    }
                                ], 'level': 2, 'ProductCategory': 'Components', 'UnitPrice': 18.13, 'SellerName': 'John', 'Country': 'USA',
                                'City': 'New York', 'UnitsSold': 240
                            }
                        ], 'level': 1
                    },
                    {
                        'Years': '2019', 'records': [
                            {
                                'ProductCategory': 'Clothing', 'UnitPrice': 49.57, 'SellerName': 'Elisa', 'Country': 'USA',
                                'City': 'New York', 'Date': '01/05/2019', 'UnitsSold': 296
                            }
                        ], 'Years_records': [
                            {
                                'Date': '01/05/2019', 'records': [
                                    {
                                        'ProductCategory': 'Clothing', 'UnitPrice': 49.57, 'SellerName': 'Elisa',
                                        'Country': 'USA', 'City': 'New York', 'Date': '01/05/2019', 'UnitsSold': 296
                                    }
                                ], 'Date_records': [{
                                    'ProductCategory': 'Clothing', 'UnitPrice': 49.57, 'SellerName': 'Elisa',
                                    'Country': 'USA', 'City': 'New York', 'Date': '01/05/2019', 'UnitsSold': 296
                                }
                                ], 'level': 2, 'ProductCategory': 'Clothing', 'UnitPrice': 49.57,
                                'SellerName': 'Elisa', 'Country': 'USA', 'City': 'New York', 'UnitsSold': 296
                            }
                        ], 'level': 1, 'ProductCategory': 'Clothing', 'UnitPrice': 49.57, 'SellerName': 'Elisa',
                        'Country': 'USA', 'City': 'New York', 'Date': '01/05/2019', 'UnitsSold': 296
                    },
                    {
                        'Years': '2020', 'records': [
                            {
                                'ProductCategory': 'Bikes', 'UnitPrice': 3.56, 'SellerName': 'Lydia',
                                'Country': 'Uruguay', 'City': 'Ciudad de la Costa', 'Date': '01/06/2020',
                                'UnitsSold': 68
                            },
                            {
                                'ProductCategory': 'Clothing', 'UnitPrice': 68.33, 'SellerName': 'Larry',
                                'Country': 'Uruguay', 'City': 'Ciudad de la Costa', 'Date': '05/12/2020',
                                'UnitsSold': 456
                            },
                            {
                                'ProductCategory': 'Clothing', 'UnitPrice': 16.05, 'SellerName': 'Walter',
                                'Country': 'Bulgaria', 'City': 'Plovdiv', 'Date': '02/19/2020', 'UnitsSold': 492
                            }
                        ], 'Years_records': [{
                            'Date': '01/06/2020', 'records': [
                                {
                                    'ProductCategory': 'Bikes', 'UnitPrice': 3.56, 'SellerName': 'Lydia',
                                    'Country': 'Uruguay', 'City': 'Ciudad de la Costa', 'Date': '01/06/2020',
                                    'UnitsSold': 68
                                }
                            ], 'Date_records': [
                                {
                                    'ProductCategory': 'Bikes', 'UnitPrice': 3.56, 'SellerName': 'Lydia',
                                    'Country': 'Uruguay', 'City': 'Ciudad de la Costa', 'Date': '01/06/2020',
                                    'UnitsSold': 68
                                }
                            ], 'level': 2, 'ProductCategory': 'Bikes', 'UnitPrice': 3.56,
                            'SellerName': 'Lydia', 'Country': 'Uruguay', 'City': 'Ciudad de la Costa',
                            'UnitsSold': 68
                        },
                        {
                            'Date': '05/12/2020', 'records': [
                                {
                                    'ProductCategory': 'Clothing', 'UnitPrice': 68.33, 'SellerName': 'Larry',
                                    'Country': 'Uruguay', 'City': 'Ciudad de la Costa', 'Date': '05/12/2020',
                                    'UnitsSold': 456
                                }
                            ], 'Date_records': [
                                {
                                    'ProductCategory': 'Clothing', 'UnitPrice': 68.33, 'SellerName': 'Larry',
                                    'Country': 'Uruguay', 'City': 'Ciudad de la Costa',
                                    'Date': '05/12/2020', 'UnitsSold': 456
                                }
                            ], 'level': 2, 'ProductCategory': 'Clothing', 'UnitPrice': 68.33,
                            'SellerName': 'Larry', 'Country': 'Uruguay', 'City': 'Ciudad de la Costa',
                            'UnitsSold': 456
                        },
                        {
                            'Date': '02/19/2020', 'records': [
                                {
                                    'ProductCategory': 'Clothing', 'UnitPrice': 16.05,
                                    'SellerName': 'Walter', 'Country': 'Bulgaria', 'City': 'Plovdiv',
                                    'Date': '02/19/2020', 'UnitsSold': 492
                                }
                            ], 'Date_records': [
                                {
                                    'ProductCategory': 'Clothing', 'UnitPrice': 16.05,
                                    'SellerName': 'Walter', 'Country': 'Bulgaria', 'City': 'Plovdiv',
                                    'Date': '02/19/2020', 'UnitsSold': 492
                                }
                            ], 'level': 2, 'ProductCategory': 'Clothing', 'UnitPrice': 16.05,
                            'SellerName': 'Walter', 'Country': 'Bulgaria', 'City': 'Plovdiv',
                            'UnitsSold': 492
                        }
                        ], 'level': 1
                    }
                ], 'level': 0, 'records': [
                    {
                        'ProductCategory': 'Clothing', 'UnitPrice': 12.81,
                        'SellerName': 'Stanley', 'Country': 'Bulgaria', 'City': 'Sofia',
                        'Date': '01/01/2021', 'UnitsSold': 282
                    },
                    {
                        'ProductCategory': 'Accessories', 'UnitPrice': 85.58,
                        'SellerName': 'David', 'Country': 'USA', 'City': 'New York',
                        'Date': '04/07/2021', 'UnitsSold': 293
                    },
                    {
                        'ProductCategory': 'Components', 'UnitPrice': 18.13, 'SellerName': 'John',
                        'Country': 'USA', 'City': 'New York', 'Date': '12/08/2021', 'UnitsSold': 240
                    },
                    {
                        'ProductCategory': 'Clothing', 'UnitPrice': 49.57, 'SellerName': 'Elisa', 'Country': 'USA', 'City': 'New York',
                        'Date': '01/05/2019', 'UnitsSold': 296
                    },
                    {
                        'ProductCategory': 'Bikes', 'UnitPrice': 3.56, 'SellerName': 'Lydia', 'Country': 'Uruguay',
                        'City': 'Ciudad de la Costa', 'Date': '01/06/2020', 'UnitsSold': 68
                    },
                    {
                        'ProductCategory': 'Clothing', 'UnitPrice': 68.33, 'SellerName': 'Larry', 'Country': 'Uruguay',
                        'City': 'Ciudad de la Costa', 'Date': '05/12/2020', 'UnitsSold': 456
                    },
                    {
                        'ProductCategory': 'Clothing', 'UnitPrice': 16.05, 'SellerName': 'Walter', 'Country': 'Bulgaria',
                        'City': 'Plovdiv', 'Date': '02/19/2020', 'UnitsSold': 492
                    }]
            }
        );
    });

    it('should generate correct levels when using predefined date dimension with other row dimensions', () => {
        data = [
            {
                ProductCategory: 'Clothing', UnitPrice: 12.81, SellerName: 'Stanley',
                Country: 'Bulgaria', City: 'Sofia', Date: '01/01/2021', UnitsSold: 282
            },
            {
                ProductCategory: 'Clothing', UnitPrice: 49.57, SellerName: 'Elisa',
                Country: 'USA', City: 'New York', Date: '01/05/2019', UnitsSold: 296
            },
            {
                ProductCategory: 'Bikes', UnitPrice: 3.56, SellerName: 'Lydia',
                Country: 'Uruguay', City: 'Ciudad de la Costa', Date: '01/06/2020', UnitsSold: 68
            },
            {
                ProductCategory: 'Accessories', UnitPrice: 85.58, SellerName: 'David',
                Country: 'USA', City: 'New York', Date: '04/07/2021', UnitsSold: 293
            },
            {
                ProductCategory: 'Components', UnitPrice: 18.13, SellerName: 'John',
                Country: 'USA', City: 'New York', Date: '12/08/2021', UnitsSold: 240
            },
            {
                ProductCategory: 'Clothing', UnitPrice: 68.33, SellerName: 'Larry',
                Country: 'Uruguay', City: 'Ciudad de la Costa', Date: '05/12/2020', UnitsSold: 456
            },
            {
                ProductCategory: 'Clothing', UnitPrice: 16.05, SellerName: 'Walter',
                Country: 'Bulgaria', City: 'Plovdiv', Date: '02/19/2020', UnitsSold: 492
            }];
        pivotConfig.rows = [
            new IgxPivotDateDimension(
                {
                    memberName: 'Date',
                    enabled: true
                },
                {
                    months: false
                }
            ),
            {
                memberName: 'City',
                enabled: true
            },
            {
                memberFunction: () => 'All',
                memberName: 'AllProducts',
                enabled: true,
                childLevel: {
                    memberName: 'ProductCategory',
                    enabled: true
                }
            }
        ];

        const rowPipeResult = rowPipe.transform(data, pivotConfig, expansionStates);
        const columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, new Map<any, boolean>());
        const rowStatePipeResult = rowStatePipe.transform(columnPipeResult, pivotConfig, expansionStates, true);

        const date_city_product = PivotGridFunctions.getDimensionData(rowStatePipeResult, pivotConfig.rows);
        expect(rowStatePipeResult.length).toEqual(37);
        const allPeriodsRecords = date_city_product.filter(x => x['AllPeriods'] === 'All Periods');
        expect(allPeriodsRecords).toEqual([
            { AllPeriods: 'All Periods', City: 'Sofia', AllProducts: 'All' },
            { AllPeriods: 'All Periods', City: 'Sofia', ProductCategory: 'Clothing' },
            { AllPeriods: 'All Periods', City: 'New York', AllProducts: 'All' },
            { AllPeriods: 'All Periods', City: 'New York', ProductCategory: 'Accessories' },
            { AllPeriods: 'All Periods', City: 'New York', ProductCategory: 'Components' },
            { AllPeriods: 'All Periods', City: 'New York', ProductCategory: 'Clothing' },
            { AllPeriods: 'All Periods', City: 'Ciudad de la Costa', AllProducts: 'All' },
            { AllPeriods: 'All Periods', City: 'Ciudad de la Costa', ProductCategory: 'Bikes' },
            { AllPeriods: 'All Periods', City: 'Ciudad de la Costa', ProductCategory: 'Clothing' },
            { AllPeriods: 'All Periods', City: 'Plovdiv', AllProducts: 'All' },
            { AllPeriods: 'All Periods', City: 'Plovdiv', ProductCategory: 'Clothing' }
        ]);

        const year2021Records = date_city_product.filter(x => x['Years'] === '2021');
        expect(year2021Records).toEqual([
            { Years: '2021', City: 'Sofia', AllProducts: 'All' },
            { Years: '2021', City: 'Sofia', ProductCategory: 'Clothing' },
            { Years: '2021', City: 'New York', AllProducts: 'All' },
            { Years: '2021', City: 'New York', ProductCategory: 'Accessories' },
            { Years: '2021', City: 'New York', ProductCategory: 'Components' }
        ]);

        const date2021Records = date_city_product.filter(x => x['Date'] === '01/01/2021');
        expect(date2021Records).toEqual([
            { Date: '01/01/2021', City: 'Sofia', AllProducts: 'All' },
            { Date: '01/01/2021', City: 'Sofia', ProductCategory: 'Clothing' }
        ]);
    });
    it('should generate correct row data with 2 dimensions with varying depth.', () => {
        // one dimension with 4 depth and one with 1 depth 
        pivotConfig.rows = [
            new IgxPivotDateDimension(
                {
                    memberName: 'Date',
                    enabled: true
                },
                {
                    months: true,
                    total: true
                }
            ),
            {
                memberName: 'ProductCategory',
                enabled: true
            }];

        let rowPipeResult = rowPipe.transform(data, pivotConfig, expansionStates);
        let columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, new Map<any, boolean>());
        let rowStatePipeResult = rowStatePipe.transform(columnPipeResult, pivotConfig, expansionStates, true);
        expect(rowStatePipeResult.length).toBe(24);

        const date_product = PivotGridFunctions.getDimensionData(rowStatePipeResult, pivotConfig.rows);

        expect(date_product).toEqual(
            [
                { AllPeriods: 'All Periods', ProductCategory: 'Clothing' },
                { AllPeriods: 'All Periods', ProductCategory: 'Accessories' },
                { AllPeriods: 'All Periods', ProductCategory: 'Components' },
                { AllPeriods: 'All Periods', ProductCategory: 'Bikes' },
                { Years: '2021', ProductCategory: 'Clothing' },
                { Years: '2021', ProductCategory: 'Accessories' },
                { Years: '2021', ProductCategory: 'Components' },
                { Months: 'January', ProductCategory: 'Clothing' },
                { Date: '01/01/2021', ProductCategory: 'Clothing' },
                { Months: 'April', ProductCategory: 'Accessories' },
                { Date: '04/07/2021', ProductCategory: 'Accessories' },
                { Months: 'December', ProductCategory: 'Components' },
                { Date: '12/08/2021', ProductCategory: 'Components' },
                { Years: '2019', ProductCategory: 'Clothing' },
                { Months: 'January', ProductCategory: 'Clothing' },
                { Date: '01/05/2019', ProductCategory: 'Clothing' },
                { Years: '2020', ProductCategory: 'Bikes' },
                { Years: '2020', ProductCategory: 'Clothing' },
                { Months: 'January', ProductCategory: 'Bikes' },
                { Date: '01/06/2020', ProductCategory: 'Bikes' },
                { Months: 'May', ProductCategory: 'Clothing' },
                { Date: '05/12/2020', ProductCategory: 'Clothing' },
                { Months: 'February', ProductCategory: 'Clothing' },
                { Date: '02/19/2020', ProductCategory: 'Clothing' }
            ]
        );

        pivotConfig.rows = [
            {
                memberName: 'ProductCategory',
                enabled: true
            },
            new IgxPivotDateDimension(
                {
                    memberName: 'Date',
                    enabled: true
                },
                {
                    months: true,
                    total: true
                }
            )
        ];

        rowPipeResult = rowPipe.transform(data, pivotConfig, expansionStates);
        columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, new Map<any, boolean>());
        rowStatePipeResult = rowStatePipe.transform(columnPipeResult, pivotConfig, expansionStates, true);
        expect(rowStatePipeResult.length).toBe(24);
        const product_date = PivotGridFunctions.getDimensionData(rowStatePipeResult, pivotConfig.rows);

        expect(product_date).toEqual(
            [
                { ProductCategory: 'Clothing', AllPeriods: 'All Periods' },
                { ProductCategory: 'Clothing', Years: '2021' },
                { ProductCategory: 'Clothing', Months: 'January' },
                { ProductCategory: 'Clothing', Date: '01/01/2021' },
                { ProductCategory: 'Clothing', Years: '2019' },
                { ProductCategory: 'Clothing', Months: 'January' },
                { ProductCategory: 'Clothing', Date: '01/05/2019' },
                { ProductCategory: 'Clothing', Years: '2020' },
                { ProductCategory: 'Clothing', Months: 'May' },
                { ProductCategory: 'Clothing', Date: '05/12/2020' },
                { ProductCategory: 'Clothing', Months: 'February' },
                { ProductCategory: 'Clothing', Date: '02/19/2020' },
                { ProductCategory: 'Bikes', AllPeriods: 'All Periods' },
                { ProductCategory: 'Bikes', Years: '2020' },
                { ProductCategory: 'Bikes', Months: 'January' },
                { ProductCategory: 'Bikes', Date: '01/06/2020' },
                { ProductCategory: 'Accessories', AllPeriods: 'All Periods' },
                { ProductCategory: 'Accessories', Years: '2021' },
                { ProductCategory: 'Accessories', Months: 'April' },
                { ProductCategory: 'Accessories', Date: '04/07/2021' },
                { ProductCategory: 'Components', AllPeriods: 'All Periods' },
                { ProductCategory: 'Components', Years: '2021' },
                { ProductCategory: 'Components', Months: 'December' },
                { ProductCategory: 'Components', Date: '12/08/2021' }
            ]
        );
    });
    it('should generate correct row data with 3 dimensions with varying depth.', () => {
        // one dimension with 3 depth, one with 2 and one with 1
        const dims = [
            new IgxPivotDateDimension(
                {
                    memberName: 'Date',
                    enabled: true
                },
                {
                    months: false,
                    total: true
                }
            ),
            {
                memberName: 'AllProduct',
                memberFunction: () => 'All Products',
                enabled: true,
                childLevel: {
                    memberName: 'ProductCategory',
                    enabled: true
                }
            },
            {
                memberName: 'SellerName',
                enabled: true
            }];
        pivotConfig.rows = [
            dims[0],
            dims[1],
            dims[2]
        ];
        let rowPipeResult = rowPipe.transform(data, pivotConfig, expansionStates);
        let columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, new Map<any, boolean>());
        let rowStatePipeResult = rowStatePipe.transform(columnPipeResult, pivotConfig, expansionStates, true);

        const date_prod_seller = PivotGridFunctions.getDimensionData(rowStatePipeResult, pivotConfig.rows);
        expect(rowStatePipeResult.length).toBe(42);

        const allPeriodsRecords = date_prod_seller.filter(x => x['AllPeriods'] === 'All Periods');
        expect(allPeriodsRecords).toEqual([
            { AllPeriods: 'All Periods', AllProduct: 'All Products', SellerName: 'Stanley' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', SellerName: 'Elisa' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', SellerName: 'Larry' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', SellerName: 'Walter' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', SellerName: 'David' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', SellerName: 'John' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', SellerName: 'Lydia' },
            { AllPeriods: 'All Periods', ProductCategory: 'Clothing', SellerName: 'Stanley' },
            { AllPeriods: 'All Periods', ProductCategory: 'Clothing', SellerName: 'Elisa' },
            { AllPeriods: 'All Periods', ProductCategory: 'Clothing', SellerName: 'Larry' },
            { AllPeriods: 'All Periods', ProductCategory: 'Clothing', SellerName: 'Walter' },
            { AllPeriods: 'All Periods', ProductCategory: 'Accessories', SellerName: 'David' },
            { AllPeriods: 'All Periods', ProductCategory: 'Components', SellerName: 'John' },
            { AllPeriods: 'All Periods', ProductCategory: 'Bikes', SellerName: 'Lydia' }
        ]);

        const year2021Records = date_prod_seller.filter(x => x['Years'] === '2021');
        expect(year2021Records).toEqual([
            { Years: '2021', AllProduct: 'All Products', SellerName: 'Stanley' },
            { Years: '2021', AllProduct: 'All Products', SellerName: 'David' },
            { Years: '2021', AllProduct: 'All Products', SellerName: 'John' },
            { Years: '2021', ProductCategory: 'Clothing', SellerName: 'Stanley' },
            { Years: '2021', ProductCategory: 'Accessories', SellerName: 'David' },
            { Years: '2021', ProductCategory: 'Components', SellerName: 'John' }
        ]);

        const date2021Records = date_prod_seller.filter(x => x['Date'] === '01/01/2021');
        expect(date2021Records).toEqual([
            { Date: '01/01/2021', AllProduct: 'All Products', SellerName: 'Stanley' },
            { Date: '01/01/2021', ProductCategory: 'Clothing', SellerName: 'Stanley' }
        ]);

        pivotConfig.rows = [
            dims[1],
            dims[0],
            dims[2]
        ];
        rowPipeResult = rowPipe.transform(data, pivotConfig, expansionStates);
        columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, new Map<any, boolean>());
        rowStatePipeResult = rowStatePipe.transform(columnPipeResult, pivotConfig, expansionStates, true);

        const prod_date_seller = PivotGridFunctions.getDimensionData(rowStatePipeResult, pivotConfig.rows);
        expect(rowStatePipeResult.length).toBe(42);
        const allProdsRecords = prod_date_seller.filter(x => x['AllProduct'] === 'All Products');
        expect(allProdsRecords).toEqual([
            { AllProduct: 'All Products', AllPeriods: 'All Periods', SellerName: 'Stanley' },
            { AllProduct: 'All Products', AllPeriods: 'All Periods', SellerName: 'David' },
            { AllProduct: 'All Products', AllPeriods: 'All Periods', SellerName: 'John' },
            { AllProduct: 'All Products', AllPeriods: 'All Periods', SellerName: 'Elisa' },
            { AllProduct: 'All Products', AllPeriods: 'All Periods', SellerName: 'Larry' },
            { AllProduct: 'All Products', AllPeriods: 'All Periods', SellerName: 'Walter' },
            { AllProduct: 'All Products', AllPeriods: 'All Periods', SellerName: 'Lydia' },
            { AllProduct: 'All Products', Years: '2021', SellerName: 'Stanley' },
            { AllProduct: 'All Products', Years: '2021', SellerName: 'David' },
            { AllProduct: 'All Products', Years: '2021', SellerName: 'John' },
            { AllProduct: 'All Products', Date: '01/01/2021', SellerName: 'Stanley' },
            { AllProduct: 'All Products', Date: '04/07/2021', SellerName: 'David' },
            { AllProduct: 'All Products', Date: '12/08/2021', SellerName: 'John' },
            { AllProduct: 'All Products', Years: '2019', SellerName: 'Elisa' },
            { AllProduct: 'All Products', Date: '01/05/2019', SellerName: 'Elisa' },
            { AllProduct: 'All Products', Years: '2020', SellerName: 'Larry' },
            { AllProduct: 'All Products', Years: '2020', SellerName: 'Walter' },
            { AllProduct: 'All Products', Years: '2020', SellerName: 'Lydia' },
            { AllProduct: 'All Products', Date: '05/12/2020', SellerName: 'Larry' },
            { AllProduct: 'All Products', Date: '02/19/2020', SellerName: 'Walter' },
            { AllProduct: 'All Products', Date: '01/06/2020', SellerName: 'Lydia' },
        ]);

        const clothingRecords = prod_date_seller.filter(x => x['ProductCategory'] === 'Clothing');
        expect(clothingRecords).toEqual([
            { ProductCategory: 'Clothing', AllPeriods: 'All Periods', SellerName: 'Stanley' },
            { ProductCategory: 'Clothing', AllPeriods: 'All Periods', SellerName: 'Elisa' },
            { ProductCategory: 'Clothing', AllPeriods: 'All Periods', SellerName: 'Larry' },
            { ProductCategory: 'Clothing', AllPeriods: 'All Periods', SellerName: 'Walter' },
            { ProductCategory: 'Clothing', Years: '2021', SellerName: 'Stanley' },
            { ProductCategory: 'Clothing', Date: '01/01/2021', SellerName: 'Stanley' },
            { ProductCategory: 'Clothing', Years: '2019', SellerName: 'Elisa' },
            { ProductCategory: 'Clothing', Date: '01/05/2019', SellerName: 'Elisa' },
            { ProductCategory: 'Clothing', Years: '2020', SellerName: 'Larry' },
            { ProductCategory: 'Clothing', Years: '2020', SellerName: 'Walter' },
            { ProductCategory: 'Clothing', Date: '05/12/2020', SellerName: 'Larry' },
            { ProductCategory: 'Clothing', Date: '02/19/2020', SellerName: 'Walter' }
        ]);

        pivotConfig.rows = [
            dims[2],
            dims[1],
            dims[0]
        ];
        rowPipeResult = rowPipe.transform(data, pivotConfig, expansionStates);
        columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, new Map<any, boolean>());
        rowStatePipeResult = rowStatePipe.transform(columnPipeResult, pivotConfig, expansionStates, true);
        expect(rowStatePipeResult.length).toBe(42);
        const seller_prod_date = PivotGridFunctions.getDimensionData(rowStatePipeResult, pivotConfig.rows);
        const stanleyRecords = seller_prod_date.filter(x => x['SellerName'] === 'Stanley');
        expect(stanleyRecords).toEqual([
            { SellerName: 'Stanley', AllProduct: 'All Products', AllPeriods: 'All Periods' },
            { SellerName: 'Stanley', AllProduct: 'All Products', Years: '2021' },
            { SellerName: 'Stanley', AllProduct: 'All Products', Date: '01/01/2021' },
            { SellerName: 'Stanley', ProductCategory: 'Clothing', AllPeriods: 'All Periods' },
            { SellerName: 'Stanley', ProductCategory: 'Clothing', Years: '2021' },
            { SellerName: 'Stanley', ProductCategory: 'Clothing', Date: '01/01/2021' },
        ]);
    });

    it('should generate correct row data with 4 dimensions with varying depth.', () => {

        // 4 dimensions - depths 3, 2, 1, 1
        const dims = [
            new IgxPivotDateDimension(
                {
                    memberName: 'Date',
                    enabled: true
                },
                {
                    months: false,
                    total: true
                }
            ),
            {
                memberName: 'AllProduct',
                memberFunction: () => 'All Products',
                enabled: true,
                childLevel: {
                    memberName: 'ProductCategory',
                    enabled: true
                }
            },
            {
                memberName: 'Country',
                enabled: true
            },
            {
                memberName: 'SellerName',
                enabled: true
            }];
        // Date, Product, Country, Seller
        pivotConfig.rows = [
            dims[0],
            dims[1],
            dims[2],
            dims[3]
        ];

        let rowPipeResult = rowPipe.transform(data, pivotConfig, expansionStates);
        let columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, new Map<any, boolean>());
        let rowStatePipeResult = rowStatePipe.transform(columnPipeResult, pivotConfig, expansionStates, true);

        const date_prod_country_seller = PivotGridFunctions.getDimensionData(rowStatePipeResult, pivotConfig.rows);
        expect(rowStatePipeResult.length).toBe(42);
        const allPeriodsData = date_prod_country_seller.filter(x => x['AllPeriods'] === 'All Periods');
        expect(allPeriodsData).toEqual([
            { AllPeriods: 'All Periods', AllProduct: 'All Products', Country: 'Bulgaria', SellerName: 'Stanley' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', Country: 'Bulgaria', SellerName: 'Walter' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', Country: 'USA', SellerName: 'Elisa' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', Country: 'USA', SellerName: 'David' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', Country: 'USA', SellerName: 'John' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', Country: 'Uruguay', SellerName: 'Larry' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', Country: 'Uruguay', SellerName: 'Lydia' },
            { AllPeriods: 'All Periods', ProductCategory: 'Clothing', Country: 'Bulgaria', SellerName: 'Stanley' },
            { AllPeriods: 'All Periods', ProductCategory: 'Clothing', Country: 'Bulgaria', SellerName: 'Walter' },
            { AllPeriods: 'All Periods', ProductCategory: 'Clothing', Country: 'USA', SellerName: 'Elisa' },
            { AllPeriods: 'All Periods', ProductCategory: 'Clothing', Country: 'Uruguay', SellerName: 'Larry' },
            { AllPeriods: 'All Periods', ProductCategory: 'Accessories', Country: 'USA', SellerName: 'David' },
            { AllPeriods: 'All Periods', ProductCategory: 'Components', Country: 'USA', SellerName: 'John' },
            { AllPeriods: 'All Periods', ProductCategory: 'Bikes', Country: 'Uruguay', SellerName: 'Lydia' }
        ]);

        const year2021Records = date_prod_country_seller.filter(x => x['Years'] === '2021');
        expect(year2021Records).toEqual([
            { Years: '2021', AllProduct: 'All Products', Country: 'Bulgaria', SellerName: 'Stanley' },
            { Years: '2021', AllProduct: 'All Products', Country: 'USA', SellerName: 'David' },
            { Years: '2021', AllProduct: 'All Products', Country: 'USA', SellerName: 'John' },
            { Years: '2021', ProductCategory: 'Clothing', Country: 'Bulgaria', SellerName: 'Stanley' },
            { Years: '2021', ProductCategory: 'Accessories', Country: 'USA', SellerName: 'David' },
            { Years: '2021', ProductCategory: 'Components', Country: 'USA', SellerName: 'John' }
        ]);

        const date2021Records = date_prod_country_seller.filter(x => x['Date'] === '01/01/2021');
        expect(date2021Records).toEqual([
            { Date: '01/01/2021', AllProduct: 'All Products', Country: 'Bulgaria', SellerName: 'Stanley' },
            { Date: '01/01/2021', ProductCategory: 'Clothing', Country: 'Bulgaria', SellerName: 'Stanley' }
        ]);

        // Country, Product, Seller, Date
        pivotConfig.rows = [
            dims[2],
            dims[1],
            dims[3],
            dims[0]
        ];

        rowPipeResult = rowPipe.transform(data, pivotConfig, expansionStates);
        columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, new Map<any, boolean>());
        rowStatePipeResult = rowStatePipe.transform(columnPipeResult, pivotConfig, expansionStates, true);
        expect(rowStatePipeResult.length).toBe(42);

        const country_prod_seller_date = PivotGridFunctions.getDimensionData(rowStatePipeResult, pivotConfig.rows);
        const bgRecords = country_prod_seller_date.filter(x => x['Country'] === 'Bulgaria');
        expect(bgRecords).toEqual([
            { Country: 'Bulgaria', AllProduct: 'All Products', SellerName: 'Stanley', AllPeriods: 'All Periods' },
            { Country: 'Bulgaria', AllProduct: 'All Products', SellerName: 'Stanley', Years: '2021' },
            { Country: 'Bulgaria', AllProduct: 'All Products', SellerName: 'Stanley', Date: '01/01/2021' },
            { Country: 'Bulgaria', AllProduct: 'All Products', SellerName: 'Walter', AllPeriods: 'All Periods' },
            { Country: 'Bulgaria', AllProduct: 'All Products', SellerName: 'Walter', Years: '2020' },
            { Country: 'Bulgaria', AllProduct: 'All Products', SellerName: 'Walter', Date: '02/19/2020' },
            { Country: 'Bulgaria', ProductCategory: 'Clothing', SellerName: 'Stanley', AllPeriods: 'All Periods' },
            { Country: 'Bulgaria', ProductCategory: 'Clothing', SellerName: 'Stanley', Years: '2021' },
            { Country: 'Bulgaria', ProductCategory: 'Clothing', SellerName: 'Stanley', Date: '01/01/2021' },
            { Country: 'Bulgaria', ProductCategory: 'Clothing', SellerName: 'Walter', AllPeriods: 'All Periods' },
            { Country: 'Bulgaria', ProductCategory: 'Clothing', SellerName: 'Walter', Years: '2020' },
            { Country: 'Bulgaria', ProductCategory: 'Clothing', SellerName: 'Walter', Date: '02/19/2020' }
        ]);

        // Product, Country, Date, Seller
        pivotConfig.rows = [
            dims[1],
            dims[2],
            dims[0],
            dims[3]
        ];

        rowPipeResult = rowPipe.transform(data, pivotConfig, expansionStates);
        columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, new Map<any, boolean>());
        rowStatePipeResult = rowStatePipe.transform(columnPipeResult, pivotConfig, expansionStates, true);
        expect(rowStatePipeResult.length).toBe(42);

        const prod_country_date_seller = PivotGridFunctions.getDimensionData(rowStatePipeResult, pivotConfig.rows);
        const allProdsRecords = prod_country_date_seller.filter(x => x['AllProduct'] === 'All Products');
        expect(allProdsRecords).toEqual([
            { AllProduct: 'All Products', Country: 'Bulgaria', AllPeriods: 'All Periods', SellerName: 'Stanley' },
            { AllProduct: 'All Products', Country: 'Bulgaria', AllPeriods: 'All Periods', SellerName: 'Walter' },
            { AllProduct: 'All Products', Country: 'Bulgaria', Years: '2021', SellerName: 'Stanley' },
            { AllProduct: 'All Products', Country: 'Bulgaria', Date: '01/01/2021', SellerName: 'Stanley' },
            { AllProduct: 'All Products', Country: 'Bulgaria', Years: '2020', SellerName: 'Walter' },
            { AllProduct: 'All Products', Country: 'Bulgaria', Date: '02/19/2020', SellerName: 'Walter' },
            { AllProduct: 'All Products', Country: 'USA', AllPeriods: 'All Periods', SellerName: 'Elisa' },
            { AllProduct: 'All Products', Country: 'USA', AllPeriods: 'All Periods', SellerName: 'David' },
            { AllProduct: 'All Products', Country: 'USA', AllPeriods: 'All Periods', SellerName: 'John' },
            { AllProduct: 'All Products', Country: 'USA', Years: '2019', SellerName: 'Elisa' },
            { AllProduct: 'All Products', Country: 'USA', Date: '01/05/2019', SellerName: 'Elisa' },
            { AllProduct: 'All Products', Country: 'USA', Years: '2021', SellerName: 'David' },
            { AllProduct: 'All Products', Country: 'USA', Years: '2021', SellerName: 'John' },
            { AllProduct: 'All Products', Country: 'USA', Date: '04/07/2021', SellerName: 'David' },
            { AllProduct: 'All Products', Country: 'USA', Date: '12/08/2021', SellerName: 'John' },
            { AllProduct: 'All Products', Country: 'Uruguay', AllPeriods: 'All Periods', SellerName: 'Larry' },
            { AllProduct: 'All Products', Country: 'Uruguay', AllPeriods: 'All Periods', SellerName: 'Lydia' },
            { AllProduct: 'All Products', Country: 'Uruguay', Years: '2020', SellerName: 'Larry' },
            { AllProduct: 'All Products', Country: 'Uruguay', Years: '2020', SellerName: 'Lydia' },
            { AllProduct: 'All Products', Country: 'Uruguay', Date: '05/12/2020', SellerName: 'Larry' },
            { AllProduct: 'All Products', Country: 'Uruguay', Date: '01/06/2020', SellerName: 'Lydia' },
        ]);
        const clothingRecords = prod_country_date_seller.filter(x => x['ProductCategory'] === 'Clothing');
        expect(clothingRecords).toEqual([
            { ProductCategory: 'Clothing', Country: 'Bulgaria', AllPeriods: 'All Periods', SellerName: 'Stanley' },
            { ProductCategory: 'Clothing', Country: 'Bulgaria', AllPeriods: 'All Periods', SellerName: 'Walter' },
            { ProductCategory: 'Clothing', Country: 'Bulgaria', Years: '2021', SellerName: 'Stanley' },
            { ProductCategory: 'Clothing', Country: 'Bulgaria', Date: '01/01/2021', SellerName: 'Stanley' },
            { ProductCategory: 'Clothing', Country: 'Bulgaria', Years: '2020', SellerName: 'Walter' },
            { ProductCategory: 'Clothing', Country: 'Bulgaria', Date: '02/19/2020', SellerName: 'Walter' },
            { ProductCategory: 'Clothing', Country: 'USA', AllPeriods: 'All Periods', SellerName: 'Elisa' },
            { ProductCategory: 'Clothing', Country: 'USA', Years: '2019', SellerName: 'Elisa' },
            { ProductCategory: 'Clothing', Country: 'USA', Date: '01/05/2019', SellerName: 'Elisa' },
            { ProductCategory: 'Clothing', Country: 'Uruguay', AllPeriods: 'All Periods', SellerName: 'Larry' },
            { ProductCategory: 'Clothing', Country: 'Uruguay', Years: '2020', SellerName: 'Larry' },
            { ProductCategory: 'Clothing', Country: 'Uruguay', Date: '05/12/2020', SellerName: 'Larry' }
        ]);
    });

    it('should generate correct row data with 5 dimensions with varying depth.', () => {
        data = [
            {
                ProductCategory: 'Clothing', UnitPrice: 12.81, SellerName: 'Stanley',
                Country: 'Bulgaria', Date: '01/01/2021', UnitsSold: 282, Discontinued: false
            },
            { ProductCategory: 'Clothing', UnitPrice: 49.57, SellerName: 'Elisa', Country: 'USA', Date: '01/05/2019', UnitsSold: 296, Discontinued: true },
            { ProductCategory: 'Bikes', UnitPrice: 3.56, SellerName: 'Lydia', Country: 'Uruguay', Date: '01/06/2020', UnitsSold: 68, Discontinued: true },
            { ProductCategory: 'Accessories', UnitPrice: 85.58, SellerName: 'David', Country: 'USA', Date: '04/07/2021', UnitsSold: 293, Discontinued: false },
            { ProductCategory: 'Components', UnitPrice: 18.13, SellerName: 'John', Country: 'USA', Date: '12/08/2021', UnitsSold: 240, Discontinued: false },
            { ProductCategory: 'Clothing', UnitPrice: 68.33, SellerName: 'Larry', Country: 'Uruguay', Date: '05/12/2020', UnitsSold: 456, Discontinued: true },
            {
                ProductCategory: 'Clothing', UnitPrice: 16.05, SellerName: 'Walter',
                Country: 'Bulgaria', Date: '02/19/2020', UnitsSold: 492, Discontinued: false
            }];
        // 5 dimensions - depths 3, 2, 2, 1, 1
        const dims = [
            new IgxPivotDateDimension(
                {
                    memberName: 'Date',
                    enabled: true
                },
                {
                    months: false,
                    total: true
                }
            ),
            {
                memberName: 'AllProduct',
                memberFunction: () => 'All Products',
                enabled: true,
                childLevel: {
                    memberName: 'ProductCategory',
                    enabled: true
                }
            },
            {
                memberName: 'AllCountries',
                memberFunction: () => 'All Countries',
                enabled: true,
                childLevel: {
                    memberName: 'Country',
                    enabled: true
                }
            },
            {
                memberName: 'SellerName',
                enabled: true
            }, {
                memberName: 'Discontinued',
                enabled: true,
                memberFunction: (rowData) => {
                    return rowData.Discontinued.toString();
                }
            }];
        // Date, Product, Country, Seller, Discontinued
        pivotConfig.rows = [
            dims[0], // Date
            dims[1], // Product
            dims[2], // Country
            dims[3], // Seller
            dims[4] // Discontinued
        ];

        let rowPipeResult = rowPipe.transform(data, pivotConfig, expansionStates);
        let columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, new Map<any, boolean>());
        let rowStatePipeResult = rowStatePipe.transform(columnPipeResult, pivotConfig, expansionStates, true);
        expect(rowStatePipeResult.length).toBe(84);
        const prod_country_date_seller_discontinued = PivotGridFunctions.getDimensionData(rowStatePipeResult, pivotConfig.rows);
        const allPeriods_allProducts_records = prod_country_date_seller_discontinued.filter(x => x['AllPeriods'] === 'All Periods' &&
            x['AllProduct'] === 'All Products');
        expect(allPeriods_allProducts_records).toEqual(
            [
                { AllPeriods: 'All Periods', AllProduct: 'All Products', AllCountries: 'All Countries', SellerName: 'Stanley', Discontinued: 'false' },
                { AllPeriods: 'All Periods', AllProduct: 'All Products', AllCountries: 'All Countries', SellerName: 'Walter', Discontinued: 'false' },
                { AllPeriods: 'All Periods', AllProduct: 'All Products', AllCountries: 'All Countries', SellerName: 'Elisa', Discontinued: 'true' },
                { AllPeriods: 'All Periods', AllProduct: 'All Products', AllCountries: 'All Countries', SellerName: 'David', Discontinued: 'false' },
                { AllPeriods: 'All Periods', AllProduct: 'All Products', AllCountries: 'All Countries', SellerName: 'John', Discontinued: 'false' },
                { AllPeriods: 'All Periods', AllProduct: 'All Products', AllCountries: 'All Countries', SellerName: 'Larry', Discontinued: 'true' },
                { AllPeriods: 'All Periods', AllProduct: 'All Products', AllCountries: 'All Countries', SellerName: 'Lydia', Discontinued: 'true' },
                { AllPeriods: 'All Periods', AllProduct: 'All Products', Country: 'Bulgaria', SellerName: 'Stanley', Discontinued: 'false' },
                { AllPeriods: 'All Periods', AllProduct: 'All Products', Country: 'Bulgaria', SellerName: 'Walter', Discontinued: 'false' },
                { AllPeriods: 'All Periods', AllProduct: 'All Products', Country: 'USA', SellerName: 'Elisa', Discontinued: 'true' },
                { AllPeriods: 'All Periods', AllProduct: 'All Products', Country: 'USA', SellerName: 'David', Discontinued: 'false' },
                { AllPeriods: 'All Periods', AllProduct: 'All Products', Country: 'USA', SellerName: 'John', Discontinued: 'false' },
                { AllPeriods: 'All Periods', AllProduct: 'All Products', Country: 'Uruguay', SellerName: 'Larry', Discontinued: 'true' },
                { AllPeriods: 'All Periods', AllProduct: 'All Products', Country: 'Uruguay', SellerName: 'Lydia', Discontinued: 'true' }
            ]
        );

        const allPeriods_clothing_records = prod_country_date_seller_discontinued.filter(x => x['AllPeriods'] === 'All Periods' && x['ProductCategory'] === 'Clothing');
        expect(allPeriods_clothing_records).toEqual([
            { AllPeriods: 'All Periods', ProductCategory: 'Clothing', AllCountries: 'All Countries', SellerName: 'Stanley', Discontinued: 'false' },
            { AllPeriods: 'All Periods', ProductCategory: 'Clothing', AllCountries: 'All Countries', SellerName: 'Elisa', Discontinued: 'true' },
            { AllPeriods: 'All Periods', ProductCategory: 'Clothing', AllCountries: 'All Countries', SellerName: 'Larry', Discontinued: 'true' },
            { AllPeriods: 'All Periods', ProductCategory: 'Clothing', AllCountries: 'All Countries', SellerName: 'Walter', Discontinued: 'false' },
            { AllPeriods: 'All Periods', ProductCategory: 'Clothing', Country: 'Bulgaria', SellerName: 'Stanley', Discontinued: 'false' },
            { AllPeriods: 'All Periods', ProductCategory: 'Clothing', Country: 'Bulgaria', SellerName: 'Walter', Discontinued: 'false' },
            { AllPeriods: 'All Periods', ProductCategory: 'Clothing', Country: 'USA', SellerName: 'Elisa', Discontinued: 'true' },
            { AllPeriods: 'All Periods', ProductCategory: 'Clothing', Country: 'Uruguay', SellerName: 'Larry', Discontinued: 'true' }
        ]);
        const allPeriods_accessories_records = prod_country_date_seller_discontinued.filter(x => x['AllPeriods'] === 'All Periods' && x['ProductCategory'] === 'Accessories');
        expect(allPeriods_accessories_records).toEqual([
            { AllPeriods: 'All Periods', ProductCategory: 'Accessories', AllCountries: 'All Countries', SellerName: 'David', Discontinued: 'false' },
            { AllPeriods: 'All Periods', ProductCategory: 'Accessories', Country: 'USA', SellerName: 'David', Discontinued: 'false' }
        ]);
        const allPeriods_components_records = prod_country_date_seller_discontinued.filter(x => x['AllPeriods'] === 'All Periods' && x['ProductCategory'] === 'Components');
        expect(allPeriods_components_records).toEqual([
            { AllPeriods: 'All Periods', ProductCategory: 'Components', AllCountries: 'All Countries', SellerName: 'John', Discontinued: 'false' },
            { AllPeriods: 'All Periods', ProductCategory: 'Components', Country: 'USA', SellerName: 'John', Discontinued: 'false' }
        ]);
        const allPeriods_bikes_records = prod_country_date_seller_discontinued.filter(x => x['AllPeriods'] === 'All Periods' && x['ProductCategory'] === 'Bikes');
        expect(allPeriods_bikes_records).toEqual([
            { AllPeriods: 'All Periods', ProductCategory: 'Bikes', AllCountries: 'All Countries', SellerName: 'Lydia', Discontinued: 'true' },
            { AllPeriods: 'All Periods', ProductCategory: 'Bikes', Country: 'Uruguay', SellerName: 'Lydia', Discontinued: 'true' }
        ]);

        // 2021
        const year_2021_records = prod_country_date_seller_discontinued.filter(x => x['Years'] === '2021');
        expect(year_2021_records).toEqual([
            { Years: '2021', AllProduct: 'All Products', AllCountries: 'All Countries', SellerName: 'Stanley', Discontinued: 'false' },
            { Years: '2021', AllProduct: 'All Products', AllCountries: 'All Countries', SellerName: 'David', Discontinued: 'false' },
            { Years: '2021', AllProduct: 'All Products', AllCountries: 'All Countries', SellerName: 'John', Discontinued: 'false' },
            { Years: '2021', AllProduct: 'All Products', Country: 'Bulgaria', SellerName: 'Stanley', Discontinued: 'false' },
            { Years: '2021', AllProduct: 'All Products', Country: 'USA', SellerName: 'David', Discontinued: 'false' },
            { Years: '2021', AllProduct: 'All Products', Country: 'USA', SellerName: 'John', Discontinued: 'false' },
            { Years: '2021', ProductCategory: 'Clothing', AllCountries: 'All Countries', SellerName: 'Stanley', Discontinued: 'false' },
            { Years: '2021', ProductCategory: 'Clothing', Country: 'Bulgaria', SellerName: 'Stanley', Discontinued: 'false' },
            { Years: '2021', ProductCategory: 'Accessories', AllCountries: 'All Countries', SellerName: 'David', Discontinued: 'false' },
            { Years: '2021', ProductCategory: 'Accessories', Country: 'USA', SellerName: 'David', Discontinued: 'false' },
            { Years: '2021', ProductCategory: 'Components', AllCountries: 'All Countries', SellerName: 'John', Discontinued: 'false' },
            { Years: '2021', ProductCategory: 'Components', Country: 'USA', SellerName: 'John', Discontinued: 'false' },
        ]);

        // 01/01/2021
        const date_2021_clothing_records = prod_country_date_seller_discontinued.filter(x => x['Date'] === '01/01/2021');
        expect(date_2021_clothing_records).toEqual([
            { Date: '01/01/2021', AllProduct: 'All Products', AllCountries: 'All Countries', SellerName: 'Stanley', Discontinued: 'false' },
            { Date: '01/01/2021', AllProduct: 'All Products', Country: 'Bulgaria', SellerName: 'Stanley', Discontinued: 'false' },
            { Date: '01/01/2021', ProductCategory: 'Clothing', AllCountries: 'All Countries', SellerName: 'Stanley', Discontinued: 'false' },
            { Date: '01/01/2021', ProductCategory: 'Clothing', Country: 'Bulgaria', SellerName: 'Stanley', Discontinued: 'false' }
        ]);
        // Discontinued, Date, Product, Country, Seller
        pivotConfig.rows = [
            dims[4],
            dims[0],
            dims[1],
            dims[2],
            dims[3]
        ];

        rowPipeResult = rowPipe.transform(data, pivotConfig, expansionStates);
        columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, new Map<any, boolean>());
        rowStatePipeResult = rowStatePipe.transform(columnPipeResult, pivotConfig, expansionStates, true);
        expect(rowStatePipeResult.length).toBe(84);
        const discontinued_prod_country_date_seller = PivotGridFunctions.getDimensionData(rowStatePipeResult, pivotConfig.rows);
        const ongoing_records = discontinued_prod_country_date_seller.filter(x => x['Discontinued'] === 'false');
        const discontinued_records = discontinued_prod_country_date_seller.filter(x => x['Discontinued'] === 'true');
        expect(discontinued_records.length).toBe(36);
        expect(ongoing_records.length).toBe(48);
        const ongoing_allPeriods = ongoing_records.filter(x => x['AllPeriods'] === 'All Periods');
        expect(ongoing_allPeriods).toEqual([
            { Discontinued: 'false', AllPeriods: 'All Periods', AllProduct: 'All Products', AllCountries: 'All Countries', SellerName: 'Stanley' },
            { Discontinued: 'false', AllPeriods: 'All Periods', AllProduct: 'All Products', AllCountries: 'All Countries', SellerName: 'Walter' },
            { Discontinued: 'false', AllPeriods: 'All Periods', AllProduct: 'All Products', AllCountries: 'All Countries', SellerName: 'David' },
            { Discontinued: 'false', AllPeriods: 'All Periods', AllProduct: 'All Products', AllCountries: 'All Countries', SellerName: 'John' },
            { Discontinued: 'false', AllPeriods: 'All Periods', AllProduct: 'All Products', Country: 'Bulgaria', SellerName: 'Stanley' },
            { Discontinued: 'false', AllPeriods: 'All Periods', AllProduct: 'All Products', Country: 'Bulgaria', SellerName: 'Walter' },
            { Discontinued: 'false', AllPeriods: 'All Periods', AllProduct: 'All Products', Country: 'USA', SellerName: 'David' },
            { Discontinued: 'false', AllPeriods: 'All Periods', AllProduct: 'All Products', Country: 'USA', SellerName: 'John' },
            { Discontinued: 'false', AllPeriods: 'All Periods', ProductCategory: 'Clothing', AllCountries: 'All Countries', SellerName: 'Stanley' },
            { Discontinued: 'false', AllPeriods: 'All Periods', ProductCategory: 'Clothing', AllCountries: 'All Countries', SellerName: 'Walter' },
            { Discontinued: 'false', AllPeriods: 'All Periods', ProductCategory: 'Clothing', Country: 'Bulgaria', SellerName: 'Stanley' },
            { Discontinued: 'false', AllPeriods: 'All Periods', ProductCategory: 'Clothing', Country: 'Bulgaria', SellerName: 'Walter' },
            { Discontinued: 'false', AllPeriods: 'All Periods', ProductCategory: 'Accessories', AllCountries: 'All Countries', SellerName: 'David' },
            { Discontinued: 'false', AllPeriods: 'All Periods', ProductCategory: 'Accessories', Country: 'USA', SellerName: 'David' },
            { Discontinued: 'false', AllPeriods: 'All Periods', ProductCategory: 'Components', AllCountries: 'All Countries', SellerName: 'John' },
            { Discontinued: 'false', AllPeriods: 'All Periods', ProductCategory: 'Components', Country: 'USA', SellerName: 'John' }
        ]);
        const ongoing_2021 = ongoing_records.filter(x => x['Years'] === '2021');
        expect(ongoing_2021).toEqual([
            { Discontinued: 'false', Years: '2021', AllProduct: 'All Products', AllCountries: 'All Countries', SellerName: 'Stanley' },
            { Discontinued: 'false', Years: '2021', AllProduct: 'All Products', AllCountries: 'All Countries', SellerName: 'David' },
            { Discontinued: 'false', Years: '2021', AllProduct: 'All Products', AllCountries: 'All Countries', SellerName: 'John' },
            { Discontinued: 'false', Years: '2021', AllProduct: 'All Products', Country: 'Bulgaria', SellerName: 'Stanley' },
            { Discontinued: 'false', Years: '2021', AllProduct: 'All Products', Country: 'USA', SellerName: 'David' },
            { Discontinued: 'false', Years: '2021', AllProduct: 'All Products', Country: 'USA', SellerName: 'John' },
            { Discontinued: 'false', Years: '2021', ProductCategory: 'Clothing', AllCountries: 'All Countries', SellerName: 'Stanley' },
            { Discontinued: 'false', Years: '2021', ProductCategory: 'Clothing', Country: 'Bulgaria', SellerName: 'Stanley' },
            { Discontinued: 'false', Years: '2021', ProductCategory: 'Accessories', AllCountries: 'All Countries', SellerName: 'David' },
            { Discontinued: 'false', Years: '2021', ProductCategory: 'Accessories', Country: 'USA', SellerName: 'David' },
            { Discontinued: 'false', Years: '2021', ProductCategory: 'Components', AllCountries: 'All Countries', SellerName: 'John' },
            { Discontinued: 'false', Years: '2021', ProductCategory: 'Components', Country: 'USA', SellerName: 'John' },
        ]);


        // Seller, Country, Date, Product, Discontinued
        pivotConfig.rows = [
            dims[3], // Seller
            dims[2], // Country
            dims[0], // Date
            dims[1], // Product
            dims[4] // Discontinued
        ];

        rowPipeResult = rowPipe.transform(data, pivotConfig, expansionStates);
        columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, new Map<any, boolean>());
        rowStatePipeResult = rowStatePipe.transform(columnPipeResult, pivotConfig, expansionStates, true);
        expect(rowStatePipeResult.length).toBe(84);
        const seller_country_date_prod_disc = PivotGridFunctions.getDimensionData(rowStatePipeResult, pivotConfig.rows);
        const stanley_allCountries_allPeriods = seller_country_date_prod_disc.filter(x => x['SellerName'] === 'Stanley' &&
            x['AllCountries'] === 'All Countries' && x['AllPeriods'] === 'All Periods');
        expect(stanley_allCountries_allPeriods).toEqual([
            { SellerName: 'Stanley', AllCountries: 'All Countries', AllPeriods: 'All Periods', AllProduct: 'All Products', Discontinued: 'false' },
            { SellerName: 'Stanley', AllCountries: 'All Countries', AllPeriods: 'All Periods', ProductCategory: 'Clothing', Discontinued: 'false' }
        ]);

        // TODO - check the rest of the 'AllCountries' fields here once issue: https://github.com/IgniteUI/igniteui-angular/issues/10662 is resolved.

        const stanley_allCountries_2021 = seller_country_date_prod_disc.filter(x => x['SellerName'] === 'Stanley' &&
            x['AllCountries'] === 'All Countries' && x['Years'] === '2021');
        expect(stanley_allCountries_2021).toEqual([
            { SellerName: 'Stanley', AllCountries: 'All Countries', Years: '2021', AllProduct: 'All Products', Discontinued: 'false' },
            { SellerName: 'Stanley', AllCountries: 'All Countries', Years: '2021', ProductCategory: 'Clothing', Discontinued: 'false' }
        ]);

        // Date, Product, Discontinued, Countries, Seller
        pivotConfig.rows = [
            dims[0], // Date
            dims[1], // Product
            dims[4], // Discontinued
            dims[2], // Country
            dims[3], // Seller
        ];

        rowPipeResult = rowPipe.transform(data, pivotConfig, expansionStates);
        columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, new Map<any, boolean>());
        rowStatePipeResult = rowStatePipe.transform(columnPipeResult, pivotConfig, expansionStates, true);
        expect(rowStatePipeResult.length).toBe(84);
        const date_prod_disc_seller = PivotGridFunctions.getDimensionData(rowStatePipeResult, pivotConfig.rows);

        const date_allPeriods_allProducts_records = date_prod_disc_seller.filter(x => x['AllPeriods'] === 'All Periods' && x['AllProduct'] === 'All Products');
        expect(date_allPeriods_allProducts_records).toEqual([
            { AllPeriods: 'All Periods', AllProduct: 'All Products', Discontinued: 'false', AllCountries: 'All Countries', SellerName: 'Stanley' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', Discontinued: 'false', AllCountries: 'All Countries', SellerName: 'Walter' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', Discontinued: 'false', AllCountries: 'All Countries', SellerName: 'David' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', Discontinued: 'false', AllCountries: 'All Countries', SellerName: 'John' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', Discontinued: 'false', Country: 'Bulgaria', SellerName: 'Stanley' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', Discontinued: 'false', Country: 'Bulgaria', SellerName: 'Walter' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', Discontinued: 'false', Country: 'USA', SellerName: 'David' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', Discontinued: 'false', Country: 'USA', SellerName: 'John' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', Discontinued: 'true', AllCountries: 'All Countries', SellerName: 'Elisa' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', Discontinued: 'true', AllCountries: 'All Countries', SellerName: 'Larry' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', Discontinued: 'true', AllCountries: 'All Countries', SellerName: 'Lydia' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', Discontinued: 'true', Country: 'USA', SellerName: 'Elisa' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', Discontinued: 'true', Country: 'Uruguay', SellerName: 'Larry' },
            { AllPeriods: 'All Periods', AllProduct: 'All Products', Discontinued: 'true', Country: 'Uruguay', SellerName: 'Lydia' }
        ]);
        const date_2021_allProducts_records = date_prod_disc_seller.filter(x => x['Years'] === '2021' && x['AllProduct'] === 'All Products');
        expect(date_2021_allProducts_records).toEqual([
            { Years: '2021', AllProduct: 'All Products', Discontinued: 'false', AllCountries: 'All Countries', SellerName: 'Stanley' },
            { Years: '2021', AllProduct: 'All Products', Discontinued: 'false', AllCountries: 'All Countries', SellerName: 'David' },
            { Years: '2021', AllProduct: 'All Products', Discontinued: 'false', AllCountries: 'All Countries', SellerName: 'John' },
            { Years: '2021', AllProduct: 'All Products', Discontinued: 'false', Country: 'Bulgaria', SellerName: 'Stanley' },
            { Years: '2021', AllProduct: 'All Products', Discontinued: 'false', Country: 'USA', SellerName: 'David' },
            { Years: '2021', AllProduct: 'All Products', Discontinued: 'false', Country: 'USA', SellerName: 'John' }
        ]);
    });
    // automation for https://github.com/IgniteUI/igniteui-angular/issues/10545
    it('should generate last dimension values for all records.', () => {
        data = [
            {
                ProductCategory: 'Clothing', UnitPrice: 12.81, SellerName: 'Stanley',
                Country: 'Bulgaria', City: 'Sofia', Date: '01/01/2021', UnitsSold: 282
            },
            {
                ProductCategory: 'Clothing', UnitPrice: 49.57, SellerName: 'Elisa',
                Country: 'USA', City: 'New York', Date: '01/05/2019', UnitsSold: 296
            },
            {
                ProductCategory: 'Bikes', UnitPrice: 3.56, SellerName: 'Lydia',
                Country: 'Uruguay', City: 'Ciudad de la Costa', Date: '01/06/2020', UnitsSold: 68
            },
            {
                ProductCategory: 'Accessories', UnitPrice: 85.58, SellerName: 'David',
                Country: 'USA', City: 'New York', Date: '04/07/2021', UnitsSold: 293
            },
            {
                ProductCategory: 'Components', UnitPrice: 18.13, SellerName: 'John',
                Country: 'USA', City: 'New York', Date: '12/08/2021', UnitsSold: 240
            },
            {
                ProductCategory: 'Clothing', UnitPrice: 68.33, SellerName: 'Larry',
                Country: 'Uruguay', City: 'Ciudad de la Costa', Date: '05/12/2020', UnitsSold: 456
            },
            {
                ProductCategory: 'Clothing', UnitPrice: 16.05, SellerName: 'Walter',
                Country: 'Bulgaria', City: 'Plovdiv', Date: '02/19/2020', UnitsSold: 492
            }];
        pivotConfig.columns = [{
            memberName: 'Country',
            enabled: true
        }];
        pivotConfig.rows = [
            new IgxPivotDateDimension(
                {
                    memberName: 'Date',
                    enabled: true
                },
                {
                    months: false
                }
            ),
            {
                memberName: 'City',
                enabled: true
            },
            {
                memberFunction: () => 'All',
                memberName: 'AllProducts',
                enabled: true,
                childLevel: {
                    memberFunction: (recData) => recData.ProductCategory,
                    memberName: 'ProductCategory',
                    enabled: true
                }
            },
            {
                memberName: 'SellerName',
                enabled: true
            }
        ];
        const rowPipeResult = rowPipe.transform(data, pivotConfig, expansionStates);
        const columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, new Map<any, boolean>());
        const rowStatePipeResult = rowStatePipe.transform(columnPipeResult, pivotConfig, expansionStates, true);
        const sellers = rowStatePipeResult.map(x => x.SellerName);
        // there should be no empty values.
        expect(sellers.filter(x => x === undefined).length).toBe(0);
    });

    // automation for https://github.com/IgniteUI/igniteui-angular/issues/10662
    it('should retain processed values for last dimension when bound to complex object.', () => {
        data = DATA;
        pivotConfig.rows = [
            {
                memberName: 'Date',
                enabled: true,
            },
            {
                memberName: 'AllProduct',
                memberFunction: () => 'All Products',
                enabled: true,
                childLevel:
                {

                    memberName: 'Product',
                    memberFunction: (recData) => recData.Product.Name,
                    enabled: true
                }
            },
            {
                memberName: 'AllSeller',
                memberFunction: () => 'All Sellers',
                enabled: true,
                childLevel:
                {
                    memberName: 'Seller',
                    memberFunction: (recData) => recData.Seller.Name,
                    enabled: true,
                },
            },
        ];

        const rowPipeResult = rowPipe.transform(data, pivotConfig, expansionStates);
        const columnPipeResult = columnPipe.transform(rowPipeResult, pivotConfig, new Map<any, boolean>());
        const rowStatePipeResult = rowStatePipe.transform(columnPipeResult, pivotConfig, expansionStates, true);

        const res = rowStatePipeResult.filter(x => x.AllSeller === undefined).map(x => x.Seller);
        // all values should be strings as the result of the processed member function is string.
        expect(res.filter(x => typeof x !== 'string').length).toBe(0);
    });
});