export const datePickerDropDownConfig = {
    days: [
        { label:'1 week', value:7},
        { label:'2 weeks', value:14},
        { label:'3 weeks', value:21}, //this will be 21 bars on the chart so might be too much for the weather icons. Maybe they are hidden after 12 bars?
        { label:'4 weeks', value:28}//this will be 28 bars on the chart so might be too much for the weather icons. Maybe they are hidden after 12 bars?
    ],
    weeks: [
        {label:'1 month', value:4},
        {label:'2 months', value:8},
        {label:'3 months', value:12},
        {label:'6 months', value:24} //this will be 24 bars on the chart so might be too much for the weather icons. Maybe they are hidden after 12 bars?
    ],
    months: [
        {label:'3 months',value:3},
        {label:'6 months',value:6},
        {label:'9 months',value:9},
        {label:'12 months',value:12}
    ]
}

/*
    If user select "Days" from the toggle group the default value of 1 week will be displayed.

    In the sampleData you will select the last 7 days from the pollinatorReportSampleData.days data

    If the user selects "2 weeks" from the dropdown the sampleData you will show
    the last 14 days from the pollinatorReportSampleData.days data  (if available)

 */
