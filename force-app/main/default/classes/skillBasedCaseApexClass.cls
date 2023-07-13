/**
@Description				: Cases are assigned based on the skills of the individuals involved. 
								In cases where multiple users possess the same skill, 
								a fair distribution is ensured through the implementation of the Round Robin method for assigning the cases.
@Author 					: Subba Reddy Venkata
@Last Modified By			: Subba Reddy
@Last Modified On			: 21/04/2023
@Modification Log			:
Ver						Date						Author							LastModification
1.0						26/04/2023					Subba Reddy Venkata				Initial Version
**/
public class skillBasedCaseApexClass {
    public static void assignCases(List<Case> caseList) {
        // Create a map to store the Skill_Name__c and Case Id
        Map<String, Id> caseCreatedWithSkill = new Map<String, Id>();
        // Iterate over each Case in the caseList
        for (Case caseCreatedWithSkills : caseList) {
            // Print the Skill__c field value of the current Case to the debug log
            system.debug('Skill__c      ' + caseCreatedWithSkills.Skill_Name__c);
            // Check if the Skill_Name__c field of the current Case is not null
            if (caseCreatedWithSkills.Skill_Name__c != null) {
                // Add the Skill_Name__c and Case Id to the caseCreatedWithSkill map
                caseCreatedWithSkill.put(caseCreatedWithSkills.Skill_Name__c, caseCreatedWithSkills.Id);
                // Print the key set of the caseCreatedWithSkill map to the debug log
                system.debug('caseCreatedWithSkill' + caseCreatedWithSkill.KeySet());
            }
        }
        // Check if the caseCreatedWithSkill map is not empty
        if (!caseCreatedWithSkill.isEmpty()) {
            // Retrieve User_Skill__c records where Skill_Name__c is present in the key set of caseCreatedWithSkill
            List<User_Skill__c > availableUsersSelectedSkill1 = [SELECT User__c, Skill_Name__c FROM User_Skill__c where Skill_Name__c IN :caseCreatedWithSkill.keySet() ];
            // Print the availableUsersSelectedSkill1 list to the debug log
            system.debug('availableUsersSelectedSkill' + availableUsersSelectedSkill1);
            // Create a map to store matching skills in selected cases and available users
            Map<String, List<String>> matchingSkillInSelectedCaseAvailableUsers = new Map<String, List<String>>();
            // Create a list to store User__c values
            List<String> userList = new List<String>(); // Move the declaration inside the loop
            // Iterate over each User_Skill__c record in the availableUsersSelectedSkill1 list
            for (User_Skill__c skillUsers : availableUsersSelectedSkill1) {
                // Print the Skill_Name__c field value of the current User_Skill__c record to the debug log
                system.debug('skillUsers.Skill_Name__c' + skillUsers.Skill_Name__c);
                // Check if the caseCreatedWithSkill map contains the Skill_Name__c value
                if (caseCreatedWithSkill.containsKey(skillUsers.Skill_Name__c)) {
                    // Add the User__c value to the userList
                    userList.Add(skillUsers.User__c);
                    // Add the User__c value as the key and the userList as the value to the matchingSkillInSelectedCaseAvailableUsers map
                    matchingSkillInSelectedCaseAvailableUsers.put(skillUsers.User__c, userList);
                }
            }
            
            System.debug('matchingSkillInSelectedCaseAvailableUsers: ' + matchingSkillInSelectedCaseAvailableUsers.Values());
            // Create a set to store User IDs
            Set<String> userIds = new Set<String>();
            // Iterate over each value (list of User IDs) in the matchingSkillInSelectedCaseAvailableUsers map
            for (List<String> userList1 : matchingSkillInSelectedCaseAvailableUsers.values()) {
                // Add all User IDs in the current list to the userIds set
                userIds.addAll(userList1);
            }
            // Print the separated User IDs (userIds set) to the debug log
            System.debug('separated ids ' + userIds);
            // Declare a variable to store the last assigned skill case
            Case lastAssignedSkillCase;
            try {
                // Retrieve the most recently created case that has an OwnerId and Skill_Name__c value using a SOQL query
                lastAssignedSkillCase = [SELECT Id, OwnerId, Skill_Name__c FROM Case WHERE OwnerId != null AND Skill_Name__c != null ORDER BY CreatedDate DESC LIMIT 1];
            } catch (Exception ex) {
                // If an exception occurs during the query, assign null to lastAssignedSkillCase
                lastAssignedSkillCase = null;
            }
            // Declare an integer variable to track the index of the user
            Integer userIndex = 0;
            // Print the size of the userIds set to the debug log
            system.debug('userIds.size()/....'+ userIds.size());
            // Check if the size of the userIds set is greater than 1
            if (userIds.size() > 1) {
                // Check if the lastAssignedSkillCase is not null and it has a non-null OwnerId
                if (lastAssignedSkillCase != null && lastAssignedSkillCase.OwnerId != null) {
                    // Initialize a counter variable "j" to keep track of the index
                    Integer j = 0;
                    // Iterate over each User ID in the "userIds" set
                    for (String userId : userIds) {
                        // Check if the current User ID is equal to the OwnerId of the lastAssignedSkillCase
                        if (userId == lastAssignedSkillCase.OwnerId) {
                           //  Check if the counter "j" is equal to the size of the "userIds" set minus 1
                            if (j == userIds.size() - 1) {
                                // Set the userIndex to 0 if it is the last User ID in the set
                                userIndex = 0;
                            } else {
                                // Calculate the userIndex as the remainder when (j + 1) is divided by the size of the "userIds" set
                                userIndex = Math.mod(j + 1, userIds.size());
                            }
                        }
                        // Increment the iteration variable
                        j++;
                    }
                }
                // Iterate over each Case in the caseList
                for (Case newCase : caseList) {
                    // Print the Skill_Name__c value of the current Case to the debug log
                    System.debug('newCase.....' + newCase.Skill_Name__c);
                    // Check if the Case has a non-null Skill_Name__c value, and its Priority is 'Low', 'Medium', or 'High', and Product__c is null
                    if (newCase.Skill_Name__c != null && (newCase.Priority == 'Low' || newCase.Priority == 'Medium' || newCase.Priority == 'High') && newCase.Product__c == null) {
                        // Check if the caseCreatedWithSkill map contains the Skill_Name__c value of the current Case
                        if (caseCreatedWithSkill.containsKey(newCase.Skill_Name__c)) {
                            // Create a list of User IDs from the userIds set
                            List<String> userIdList = new List<String>(userIds);
                            if (!userIdList.isEmpty()) { // Check if the list is empty before accessing elements
                                // Assign the User ID at the current userIndex to the OwnerId of the Case
                                newCase.OwnerId = userIdList[userIndex];
                                // Increment the userIndex and apply modular arithmetic to wrap around to the beginning if necessary
                                userIndex = Math.mod(userIndex + 1, userIds.size());
                            }
                        }
                    }
                }
            } 
             // Check if the size of the userIds set is less than or equal to 1
            else if (userIds.size() <= 1) {
                // Iterate over each Case in the caseList
                for (Case css : caseList) {
                     // Check if the Case has a non-null Skill_Name__c value, and its Priority is 'Low', 'Medium', or 'High', and Product__c is null
                    if (css.Skill_Name__c != null && (css.Priority == 'Low' || css.Priority == 'Medium' || css.Priority == 'High') && css.Product__c == null) {
                        // Create a list of User IDs from the userIds set
                        List<String> userIdList = new List<String>(userIds);
                        // Check if the userIdList is not empty before accessing elements
                        if (!userIdList.isEmpty()) { // Check if the list is empty before accessing elements
                             // Assign the User ID at the current userIndex to the OwnerId of the Case
                            css.OwnerId = userIdList[userIndex];
                        }
                    }
                }
            }
        }
    }
}