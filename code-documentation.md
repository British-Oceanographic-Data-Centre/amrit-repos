# Code documentation
AMRIT is a collection of different services/apps written in different languages. For consistence we are suggesting the following methods/style are used for documentation within code regardless of language.
This can be broken down into four key areas

## Documentation styles
We require that each method contains a description of what the method does, the types it takes in as arguments (if these are required or optional) and the type the method returns (if any). 

### first example
```python
def my_odd_method(parm1: str, param2: int, param3: bool = false):
    """This is a silly example.

    # This method takes in a string and a integer and a boolean, if the boolean is false (Default) then the method joins both parameters together in a string. 
    if the boolean is true the method converts the string to an integer and add the integer together.
    This method always out puts a string. 

    Args:
        param1 (str): a valid calendar day (range 1-31).
        param2 (int): a valid month (range 1-12).
        param3 (bool): Optional - should these values been added (true) or append (false).        
    
    Returns:
        str: a string containing one number. 
    """
    
    if(param3)
        answer = f"{int(param1) + param2}" 
    else 
        answer = f"{param1}{param2}"
    
    return answer
```
### Variable naming
We can take the above example and make improvments by the use of explicit and descriptive names for methods and parameters, even if they are longer, to improve readability and reduce the need for comments.
Clear naming makes code self-explanatory, minimizes ambiguity, and improves maintainability.

#### A better example
```python
def add_values_or_concatenate(calendar_day_number: str, month_number: int, add_values: bool = false) -> str:
    """This is a silly example.

    # This method takes in a string and a integer and a boolean, if the boolean is false (Default) then the method joins both parameters together in a string. 
    if the boolean is true the method converts the string to an integer and add the integer together.
    This method always out puts a string. 

    Args:
        calendar_day_number (str): a valid calendar day (range 1-31).
        month_number (int): a valid month (range 1-12).
        add_values (bool): Optional - should these values been added (true) or append (false).        
    
    Returns:
        str: a string containing one number. 
    """
    
    if(add_values)
        answer = f"{int(calendar_day_number) + month_number}" 
    else 
        answer = f"{calendar_day_number}{month_number}"
    
    return answer
```
## Automation
Where possible github action will be deployed to enforce code documentation.
GitHub Actions should check for documentation presence and format, but can avoid being overly strict on trivial methods.

## Consistency
There are several different option on how this documentation is presented, if possible we are asking for documentation to follow the google style.
Whatever code documentation style is used within a repo must be continued for consistence.

## Code refactoring
When a function or method is complex, it should ideally be broken down into smaller, more manageable components.
This approach simplifies maintenance, as developers can focus on understanding and working with a single, isolated part of the logic without the risk of inadvertently breaking a larger, more intricate function. 
If this is not possible, say for a complex calculations, then adding inline or multiline code comments are a good solution. 
They can help a reader understand what is happening and allow for a reviewer to make sure that what is commented and what is coded are in fact the same thing. 
That said, we suggest inline comments are used sparingly, only for critical pathways or non-obvious logic.