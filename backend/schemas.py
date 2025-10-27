from typing import List, Dict, Any
from models import Task


class TaskSchema:
    """
    Serialization layer for Task models.
    
    Separates internal model representation from API contracts.
    In production, consider using marshmallow or pydantic for:
    - Automatic validation
    - Nested serialization
    - API versioning
    """
    
    @staticmethod
    def serialize(task: Task) -> Dict[str, Any]:
        """
        Convert Task model to JSON-safe dict.
        
        Date formatting is explicit for client predictability.
        """
        return {
            'id': task.id,
            'title': task.title,
            'completed': task.completed,
            'createdAt': task.created_at.isoformat() + 'Z'  # ISO 8601 with UTC marker
        }
    
    @staticmethod
    def serialize_many(tasks: List[Task]) -> List[Dict[str, Any]]:
        """Serialize a list of tasks."""
        return [TaskSchema.serialize(task) for task in tasks]