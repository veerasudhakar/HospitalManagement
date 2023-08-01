import { LightningElement } from 'lwc';

export default class GetDirection extends LightningElement {
    mapMarkers;
    zoomLevel;
    listView;
    mapMarkers = [
        {
            location: {
                City: 'Hyderabad',
                Country: 'India',
                PostalCode: '500081',
                State: 'TS',
                Street: 'Hitech City Rd, Patrika Nagar,',
            },
            
            title: 'Wissen Hyderabad Location',
            description:'The Landmark is considered to be one of the Hi-city', 
            icon: 'standard:account',
            
        },
        {
            location: {
                City: 'Bangalore',
                Country: 'India',
                PostalCode: '560066',
                State: 'KN',
                Street: 'No.176, Adarsh Eco Place, 4th Floor, Epip 2nd Phase,',
            },
            
            title: 'Wissen Bangalore Location',
            description:'The Landmark is considered to be one of the Whitefield', 
            icon: 'standard:account',
            
        },
        
];
    zoomLevel = 15;
    listView = 'visible';
}