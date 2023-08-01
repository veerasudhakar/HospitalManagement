/**
@Description			: This schedulable Apex class automatically Create a Schedule job for every record when a Case is created, based on the Before Case Escalation time values specified in the Custom Settings. 
The purpose of these notifications is to remind the Case Owner to take action on the Case before it reaches the specified Before Case Escalation time.
@Author					: Surendranath Reddy
@Last Modified By		: Surendranath Reddy, Subba Reddy	
@Last Modified On		: 02/06/2023
@Modification Log		:
Ver			Date				Author									LastModification
1.0			28/05/2023			Surendranath Reddy, Subba Reddy			Initial Version
**/
public class BeforeEscalationMailHandler {
   public static void schedulebeforeEscalation(List<Case> newCases) {
       
    
       for (Case c: newCases) {
            if (c.Status != 'Escalated' && c.Status != 'Closed') { // only schedule escalation job for non-escalated cases
                DynamicTimeValuesForEscalation__c escalationMentionedTimeValue = DynamicTimeValuesForEscalation__c.getInstance();
                system.debug('escalationMentionedTimeValue: ' + escalationMentionedTimeValue);
                if (escalationMentionedTimeValue != null) {
                String timeString = escalationMentionedTimeValue.BeforeCaseEscalationTimeForEmailAlert__c;
                List<String> timeComponents = timeString.split(':');
                   system.debug('timeComponents'+timeComponents);
                Integer hours = Integer.valueOf(timeComponents[0]);
                Integer minutes = Integer.valueOf(timeComponents[1]);
                Integer seconds = Integer.valueOf(timeComponents[2]);
                    system.debug('hours minutes'+hours +minutes+seconds);

                system.debug('Hours: ' + hours);
                system.debug('Minutes: ' + minutes);
                system.debug('Seconds: ' + seconds);

                DateTime createdDateTime = c.CreatedDate;
                    system.debug('created datetime : ' +createdDateTime);
                Integer createdHour =createdDateTime.hour();
                    system.debug('created Hour : ' +createdHour);
                Integer createdDay = createdDateTime.day();
                    
                Integer createdMonth = createdDateTime.month();
                Integer createdYear = createdDateTime.year();
                Integer createdMinute = createdDateTime.minute();
                Integer createdSecond = createdDateTime.second();

                Integer escalatedHour;
                Integer escalatedDay;

                Integer totalMinutes = createdMinute + minutes;
                Integer extraHours = totalMinutes / 60;
                Integer adjustedMinutes = Math.mod(totalMinutes, 60);
               // system.debug('escalatedHour' + escalatedHour);
                escalatedHour = createdHour + hours + extraHours;
                system.debug('escalatedHour' + escalatedHour);

                if (escalatedHour > 23) {
                    escalatedHour = escalatedHour - 24;
                    escalatedDay = createdDay + 1;
                    system.debug('escalatedHour: ' + escalatedHour);
                } else {
                    escalatedDay = createdDay;
                    system.debug('Else escalatedHour: ' + escalatedHour);
                }

                // Handle months with 30 days
                Integer daysInMonth = Date.daysInMonth(createdYear, createdMonth);
                if (escalatedDay > daysInMonth) {
                    escalatedDay = escalatedDay - daysInMonth;
                    createdMonth++; // Increment the month
                }

                String scheduledHour = String.valueOf(escalatedHour);
                String scheduledDay = String.valueOf(escalatedDay);
                String scheduledMinute = String.valueOf(adjustedMinutes);
                String scheduledMonth = String.valueOf(createdMonth);
                String scheduledYear = String.valueOf(createdYear);
                String scheduledSecond = String.valueOf(createdSecond);

                String cronExpression = scheduledSecond + ' ' + scheduledMinute + ' ' + scheduledHour + ' ' + scheduledDay + ' ' + scheduledMonth + ' ? ' + scheduledYear;
                system.debug('cronExpression: ' + cronExpression);

                String jobID = System.schedule('Dynamic Case Before Escalation Schedule Date and Time -- ' + c.Id, cronExpression, new SendMailtoQueueMembers(c, c.Id));
            }
            }
        }
       
    }
}