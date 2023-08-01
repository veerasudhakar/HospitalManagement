/**
@Description			: This schedulable Apex class automatically sends email alerts or notifications to the Case Owner when a Case is created, based on the Case Escalation time values specified in the Custom Settings. 
The purpose of these notifications is to remind the Case Owner to take action on the Case before it reaches the specified Case Escalation time.
@Author					: Surendranath Reddy, Subba Reddy, Sprutiraj Panda
@Last Modified By		: Surendranath Reddy, Sprutiraj
@Last Modified On		: 21/04/2023
@Modification Log		:
Ver			Date				Author									LastModification
1.0			26/04/2023			Surendranath Reddy, Subba Reddy			Initial Version
Sprutiraj Panda
**/

public class SendMailtoQueueMembers implements Schedulable {
   private Case newListCase;
    private Id caseId;
    
    public SendMailtoQueueMembers(Case newListCase, Id caseId) {
        // Represents a Case object (presumably a newly created case) that needs to be escalated.
       this.newListCase = newListCase;
        // Represents the Id of the case that needs to be escalated.
        this.caseId = caseId;
    }  
    public void execute(SchedulableContext sc) {
       
        system.debug('hhhh'+newListCase);
        system.debug('jjjj'+caseId);
      case c2=[select id,Skill_Name__c,OwnerId,CaseNumber,Owner.Name,Subject,Description,Priority,Status from case where id=:caseId];       
        Set<String> emails = new Set<String>();
        set<Id> UserIds = new set<Id>();
        
        if(c2.Skill_Name__c == Null){
        set<Id> queueIds = new set<Id>();
            queueIds.add(c2.OwnerId);
        List<Group> queues = new List<Group>();
        // If the Queue ID is not null, add it to the "queueIds" set
            if(queueIds.size() != 0) {
                queues = [SELECT Id FROM Group WHERE Id IN: queueIds];
            }
        
        system.debug('queues...'+queues.size());
        for(GroupMember gm : [SELECT Id, UserOrGroupId FROM GroupMember WHERE GroupId IN: queues]){
            UserIds.add(gm.UserOrGroupId);
        }
            }
        else if(c2.Skill_Name__c != Null){
            UserIds.add(c2.OwnerId);
        }
        system.debug('UserIds....'+UserIds);
        
        // Query the User records where the Id is present in the "queueIds" set
        List<User> users = [SELECT Id, Email FROM User WHERE Id IN :userIds];
        
        // Iterate over each User record
        for (User u : users) {
            // Add the User email to the "emails" set
            emails.add(u.Email);
        }
        
        // Print the User IDs and User emails
        system.debug('User IDs: ' + userIds);
        system.debug('User emails: ' + emails);
        
        // Create a Set to store the User Ids
       
        // Output a debug message with the content of the "emails" set for testing and troubleshooting purposes
        System.debug('emails: ' + emails);
        // Convert the "emails" set to a list of email addresses
        List<String> emailAddresses = new List<String>(emails);
        System.debug('emailAddresses: ' + emailAddresses);
        // Create an empty list to store the email messages
        List<Messaging.SingleEmailMessage> msgEmails = new List<Messaging.SingleEmailMessage>();
        System.debug('msgEmails: ' + msgEmails);
        // Query Case records that have a status of 'New' and were created before or at the specified time threshold
        // Retrieve fields: Id, CaseNumber, Status, Subject, Owner.Name, Priority, Description, CreatedDate
        // Store the query results in the "cases" list
    List<Case> cases1 = new List<Case>();
        cases1.add(c2);
        // Output a debug message with the content of the "cases" list for testing and troubleshooting purposes
        System.debug('cases: ' + cases1);
        // Iterate over each Case record in the "cases" list
        for (Case c : cases1) {
            // Create a new instance of SingleEmailMessage to compose an email message
            Messaging.SingleEmailMessage msg = new Messaging.SingleEmailMessage();
            // Set the recipient email addresses for the email message to the values in the "emailAddresses" list
            msg.setToAddresses(emailAddresses);
            /*    List<String> emailAddresses11 = new List<String>();
emailAddresses11.add('mr19043@gmail.com');

msg.setToAddresses(emailAddresses11);  */
            System.debug('msg: ' + msg);
            // Compose the body of the email message
            String body = '<p>Dear Team,</p>';
            body += '<p>This is to inform you that Case ' + c.CaseNumber + ' needs your attention. The Case has been assigned to the ' + c.Owner.Name + ' owner, but it has not been resolved yet.</p>';
            body += '<p>Please review the details below and take appropriate action before the Case is escalated:</p>';
            body += '<p><li>Case Number: ' + c.CaseNumber + ' </li><br/><li> Subject: ' + c.Subject + '</li><br/><li> Description: ' + c.Description + '</li><br/><li>  Priority: ' + c.Priority + '</li><br/><li> Status: ' + c.Status + '</li> <br/> Please note that the Case is scheduled to be escalated in 2 hours. If you are unable to resolve the Case by then, please reassign it to an appropriate resource or escalate it to the next level of support.</p>';
            body += '<p>Thank you for your prompt attention to this matter. Please go through the below case details.</p>';
            body += '<p><a href="' + URL.getSalesforceBaseUrl().toExternalForm() + '/' + c.Id + '">View Case Details</a></p>';
            body += '<p>Thanks & Regards,</p>';
            body += '<p>Support Team</p>';
            // Set the HTML body of the email message using the composed body string
            msg.setHtmlBody(body);
            // Set the subject of the email message
            msg.setSubject('Case is going to be Escalate');
            // Set the sender display name for the email message
            msg.setSenderDisplayName('Salesforce Admin');
            // Add the email message to the "msgEmails" list
            msgEmails.add(msg);
            System.debug('msgEmails: ' + msgEmails);
        }
        // Try to execute the following code block
        try{
            // Check if the list of email messages is not empty
            if (!msgEmails.isEmpty()) {
                // Send the email messages using the Messaging.sendEmail() method
                Messaging.sendEmail(msgEmails);
            } else {
                // Output a debug message indicating that no new cases were found for escalation
                System.debug('No new cases found for escalation');
            }
        }
        // Catch any exceptions that occur during execution
        catch(Exception e){
            // Output a debug message with the error message from the caught exception
            System.debug('An error occurred while sending emails: ' + e.getMessage());
        }
        
    }

}