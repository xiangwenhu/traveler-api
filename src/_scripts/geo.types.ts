interface Neighborhood {
    name: any[];
    type: any[];
}
interface Geocodes {
    formatted_address: string;
    country: string;
    province: string;
    citycode: string;
    city: string;
    district: string;
    township: any[];
    neighborhood: Neighborhood;
    building: Neighborhood;
    adcode: string;
    street: any[];
    number: any[];
    location: string;
    level: string;
}
export interface ResJson {
    status: string;
    info: string;
    infocode: string;
    count: string;
    geocodes: Geocodes[];
}