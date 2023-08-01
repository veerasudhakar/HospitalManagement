/**
@Description			: This class assigns cases to different queues based on their priority.
@Author					: Sprutiraj Panda, Surendranath Reddy, SubbaReddy Venkata, Sravani Bandaru 
@Last Modified By		: Subba Reddy Venkata, Sprutiraj Panda
@Last Modified On		: 25/04/2023
@Modification Log		:
Ver					Date						Author										LastModification
1.0					26/04/2023					Sprutiraj Panda           					Initial Version
												SubbaReddy Venkata
**/
public class CaseActionsApexClass 
{
    // Assign cases to appropriate queues based on specific conditions
    public static void assignCases(List<Case> casesToAssign)
    {
        // Get the queue Id for the high priority case team
        Group priorityHighQueueId = [SELECT Id FROM Group WHERE Type = 'Queue' AND Name = 'High Priority Case Team' LIMIT 1];
        // Get the queue Id for the product support case team
        Group supportOnProductQueueId = [SELECT Id FROM Group WHERE Type = 'Queue' AND Name = 'Product Support Case Team' LIMIT 1];
        
        for(Case c : casesToAssign){
            // Check if the case has a product but no specific skill assigned
            if(c.Product__c != null && (c.Skill_Name__c == null) && (c.Priority == 'Low' || c.Priority == 'Medium' || c.Priority == 'High')){
                // Assign the case to the product support queue
                c.OwnerId = supportOnProductQueueId.Id; 
            }
            // Check if the case is of high priority and has no specific skill or product assigned
            Else if(c.Priority == 'High' && (c.Skill_Name__c == null) && (c.Product__c == null)){
                // Assign the case to the high priority queue
                c.OwnerId = priorityHighQueueId.Id;
            }
            // Check if the case has both a product and a specific skill assigned
            Else if((c.Priority == 'High' ||c.Priority == 'Low' || c.Priority == 'Medium') && (c.Skill_Name__c != null) && (c.Product__c != null)){
                // Display an error message
                c.AddError('Both Product and My Skill Do not select at a time');
            }
        }
        
    }
}