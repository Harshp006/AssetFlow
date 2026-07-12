export interface PaginationQuery {

    page?: number;

    limit?: number;

    search?: string;

    sortBy?: string;

    order?: "ASC" | "DESC";

}