from dataclasses import dataclass, field
from datetime import datetime
from uuid import uuid4


@dataclass
class Task:
    """
    Task domain model.
    
    Uses dataclass for clean serialization and immutability patterns.
    ID is always generated server-side to prevent client tampering.
    """
    id: str = field(default_factory=lambda: str(uuid4()))
    title: str = ""
    completed: bool = False
    created_at: datetime = field(default_factory=datetime.utcnow)
    
    @classmethod
    def create(cls, title: str) -> 'Task':
        """
        Factory method for creating new tasks.
        Ensures consistent initialization and validation.
        """
        if not title or not title.strip():
            raise ValueError("Task title cannot be empty")
        
        return cls(title=title.strip())
    
    def toggle(self) -> 'Task':
        """
        Returns a new Task instance with toggled completion state.
        Follows immutability pattern for easier state management.
        """
        return Task(
            id=self.id,
            title=self.title,
            completed=not self.completed,
            created_at=self.created_at
        )