from typing import List, Optional
from models import Task


class TaskRepository:
    """
    Repository Pattern implementation for Task persistence.
    
    Currently uses in-memory storage, but interface is designed
    to make swapping to Postgres/SQLite trivial:
    - All methods return domain models, not raw dicts
    - No business logic here, just CRUD
    - Easy to add async/await later
    
    In production, this becomes a SQLAlchemy/Tortoise ORM wrapper.
    """
    
    def __init__(self):
        self._tasks: List[Task] = []
    
    def get_all(self) -> List[Task]:
        """Retrieve all tasks."""
        return self._tasks.copy()
    
    def get_by_id(self, task_id: str) -> Optional[Task]:
        """Retrieve a single task by ID."""
        return next((t for t in self._tasks if t.id == task_id), None)
    
    def create(self, task: Task) -> Task:
        """
        Persist a new task.
        
        Args:
            task: Task domain model (ID already assigned)
        
        Returns:
            The persisted task
        """
        self._tasks.append(task)
        return task
    
    def update(self, task_id: str, task: Task) -> Optional[Task]:
        """
        Update an existing task.
        
        Args:
            task_id: ID of task to update
            task: Updated task model
        
        Returns:
            Updated task if found, None otherwise
        """
        for i, t in enumerate(self._tasks):
            if t.id == task_id:
                self._tasks[i] = task
                return task
        return None
    
    def delete(self, task_id: str) -> bool:
        """
        Delete a task by ID.
        
        Returns:
            True if task was deleted, False if not found
        """
        initial_length = len(self._tasks)
        self._tasks = [t for t in self._tasks if t.id != task_id]
        return len(self._tasks) < initial_length
    
    def delete_completed(self) -> int:
        """
        Delete all completed tasks.
        
        Returns:
            Count of deleted tasks
        """
        initial_length = len(self._tasks)
        self._tasks = [t for t in self._tasks if not t.completed]
        return initial_length - len(self._tasks)