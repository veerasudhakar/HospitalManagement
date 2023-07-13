/**
@Description		: This schedulable Apex class automatically assigns cases to different shifts based on their respective shift times. 
						Each case is assigned to the appropriate shift queue according to the time boundaries defined for each shift.
@Author				: Surendranath Reddy, Subba Reddy Venkata
@Last Modified By	: Surendranath Reddy
@Last Modified On	: 21/04/2023
@Modification Log	:
Ver				Date					Author									LastModification
1.0				26/04/2023     			Surendranath Reddy, Subba Reddy			Initial Version
**/
public class AssignCasesToShiftQueueScheduler implements Schedulable
{
     // Method to parse time value from string format
    private static time parseTime(String timeValue) {
        // Splitting the time value string by ":" delimiter
        String[] strTimeSplit = timeValue.split(':');
        // Creating a new instance of Time with the parsed hour and minute values
    	// The seconds and milliseconds are set to 0
        Time timeChange = Time.newInstance(Integer.valueOf(strTimeSplit[0]) ,Integer.valueOf(strTimeSplit[1]) ,0 ,0);
        // Returning the parsed time
        return timeChange;
    }
    // Scheduler execution method
    public void execute(SchedulableContext sc)
    {
        // Retrieve ShiftTime__c custom settings
        ShiftTime__c shiftTimes = ShiftTime__c.getInstance();
        // Parse shift start and end times
        Time shift1StartTime = parseTime(shiftTimes.Shift1StartTime__c);
        system.debug('shift1StartTime' + shift1StartTime);
        Time shift1EndTime = parseTime(shiftTimes.Shift1EndTime__c);
        system.debug('shift1EndTime' + shift1EndTime);
        Time shift2StartTime = parseTime(shiftTimes.Shift2StartTime__c);
         system.debug('shift2StartTime' + shift2StartTime);
        Time shift2EndTime = parseTime(shiftTimes.Shift2EndTime__c);
        Time shift3StartTime = parseTime(shiftTimes.Shift3StartTime__c);
        Time shift3EndTime = parseTime(shiftTimes.Shift3EndTime__c);
        // Get the Morning shift queue
        Group morningShiftQueue = [SELECT Id, Name FROM Group WHERE Type = 'Queue' AND Name = 'Morning Shift'];
        // Get the afternoon shift queue
        Group afternoonShiftQueue = [SELECT Id, Name FROM Group WHERE Type = 'Queue' AND Name = 'Afternoon Shift'];
        // Get the night shift queue
        Group nightShiftQueue = [SELECT Id, Name FROM Group WHERE Type = 'Queue' AND Name = 'Night Shift'];
        // Create a set of queue Ids for Each Shift
        set<id> ids = new set<id>();
        ids.add(morningShiftQueue.Id);
        ids.add(afternoonShiftQueue.Id);
        ids.add(nightShiftQueue.Id);
        // Get the cases that are in the Every shift queue and not closed yet
        List<Case> allShiftCases = [SELECT Id, OwnerId , Status FROM Case WHERE Status = 'New' AND OwnerId IN: ids];
        // List to store cases that will be updated with new owners
        List<Case> AllShiftsUpdatedCases = new List<Case>();
        // Iterate through the cases and update owner based on current time and shift boundaries
        for(Case cs: allShiftCases){
            // Get the current time as a Time instance with seconds set to zero
            Time currentTime = Time.newInstance(
                    Datetime.now().hour(),
                    Datetime.now().minute(),
                    Datetime.now().second(),
                    0
                );
            // Check if the current time falls within Shift 1 time range
            if(currentTime >= Shift1StartTime && currentTime < Shift1EndTime){
                // Assign the morning shift queue's Id to the OwnerId field of the Case
                cs.OwnerId = morningShiftQueue.Id;
                // Add the Case to the "AllShiftsUpdatedCases" list
                AllShiftsUpdatedCases.Add(cs);
            }
            // Check if the current time falls within Shift 2 time range
            Else if (currentTime >= Shift2StartTime && currentTime < Shift2EndTime){
                // Assign the afternoon shift queue's Id to the OwnerId field of the Case
                cs.OwnerId = afternoonShiftQueue.Id;
                // Add the Case to the "AllShiftsUpdatedCases" list
                AllShiftsUpdatedCases.Add(cs);
            }
            // Check if the current time falls within Shift 3 time range
            Else if (currentTime >= Shift3StartTime && currentTime < Shift3EndTime){
                // Assign the night shift queue's Id to the OwnerId field of the Case
                cs.OwnerId = nightShiftQueue.Id;
                // Add the Case to the "AllShiftsUpdatedCases" list
                AllShiftsUpdatedCases.Add(cs);
            }
        }
          // Update cases if there are any changes
        if(!AllShiftsUpdatedCases.IsEmpty()){
            update AllShiftsUpdatedCases;
        }
    }
}