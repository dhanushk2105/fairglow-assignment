from typing import List, Optional
from models import Task
from repository import TaskRepository


class TaskService:
    """
    Business logic layer for task operations.
    
    This layer:
    - Validates inputs
    - Enforces business rules
    - Coordinates repository calls
    - Has ZERO Flask dependencies (fully testable)
    
    In a real app, this is where you'd add:
    - Per-user filtering
    - Complex validation (e.g., duplicate detection)
    - Event publishing (e.g., task.created webhook)
    """
    
    def __init__(self, repository: TaskRepository):
        self.repo = repository
    
    def get_all_tasks(self) -> List[Task]:
        """
        Retrieve all tasks.
        
        In production, add filtering:
        - user_id scope
        - date ranges
        - completion status
        """
        return self.repo.get_all()
    
    def create_task(self, title: str) -> Task:
        """
        Create a new task with validation.
        
        Raises:
            ValueError: If title is empty or invalid
        """
        # Validation happens in Task.create() factory
        task = Task.create(title)
        return self.repo.create(task)
    
    def toggle_complete(self, task_id: str) -> Optional[Task]:
        """
        Toggle a task's completion status.
        
        Returns:
            Updated task if found, None otherwise
        """
        task = self.repo.get_by_id(task_id)
        if not task:
            return None
        
        updated_task = task.toggle()
        return self.repo.update(task_id, updated_task)
    
    def delete_task(self, task_id: str) -> bool:
        """
        Delete a single task.
        
        Idempotent: returns True even if task doesn't exist.
        This prevents client-side errors on double-delete.
        """
        # In production, you might want to verify ownership
        # before deletion (check user_id)
        self.repo.delete(task_id)
        return True  # Idempotent: always succeed
    
    def delete_completed_tasks(self) -> int:
        """
        Bulk delete all completed tasks.
        
        Returns:
            Count of deleted tasks
        """
        return self.repo.delete_completed()