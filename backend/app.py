from flask import Flask, request, jsonify
from flask_cors import CORS
from models import Task
from repository import TaskRepository
from services import TaskService
from schemas import TaskSchema
from security import rate_limit, validate_task_input


# Initialize Flask app
app = Flask(__name__)

# CORS Configuration
CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

repository = TaskRepository()
service = TaskService(repository)


@app.errorhandler(404)
def not_found(error):
    """Custom 404 handler - never leak stack traces."""
    return jsonify({'error': 'Resource not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    """Custom 500 handler - never leak stack traces."""
    return jsonify({'error': 'Internal server error'}), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring."""
    return jsonify({'status': 'healthy'}), 200


@app.route('/tasks', methods=['GET'])
def get_tasks():
    """
    Get all tasks.
    
    Returns:
        200: List of tasks
    """
    try:
        tasks = service.get_all_tasks()
        return jsonify(TaskSchema.serialize_many(tasks)), 200
    except Exception as e:
        app.logger.error(f"Error fetching tasks: {str(e)}")
        return jsonify({'error': 'Failed to fetch tasks'}), 500


@app.route('/tasks', methods=['POST'])
@rate_limit
def create_task():
    """
    Create a new task.
    
    Request Body:
        {
            "title": "Task description"
        }
    
    Returns:
        201: Created task
        400: Invalid input
    """
    try:
        data = request.get_json()
        
        # Validate input
        is_valid, error_msg = validate_task_input(data)
        if not is_valid:
            return jsonify({'error': error_msg}), 400
        
        # Create task
        task = service.create_task(data['title'])
        return jsonify(TaskSchema.serialize(task)), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        app.logger.error(f"Error creating task: {str(e)}")
        return jsonify({'error': 'Failed to create task'}), 500


@app.route('/tasks/<task_id>', methods=['PATCH'])
@rate_limit
def toggle_task(task_id):
    """
    Toggle task completion status.
    
    Args:
        task_id: UUID of task to toggle
    
    Returns:
        200: Updated task
        404: Task not found
    """
    try:
        task = service.toggle_complete(task_id)
        
        if not task:
            return jsonify({'error': 'Task not found'}), 404
        
        return jsonify(TaskSchema.serialize(task)), 200
        
    except Exception as e:
        app.logger.error(f"Error toggling task {task_id}: {str(e)}")
        return jsonify({'error': 'Failed to update task'}), 500


@app.route('/tasks/<task_id>', methods=['DELETE'])
@rate_limit
def delete_task(task_id):
    """
    Delete a single task.
    
    Idempotent: returns 200 even if task doesn't exist.
    
    Args:
        task_id: UUID of task to delete
    
    Returns:
        200: Success (idempotent)
    """
    try:
        service.delete_task(task_id)
        return jsonify({'message': 'Task deleted successfully'}), 200
        
    except Exception as e:
        app.logger.error(f"Error deleting task {task_id}: {str(e)}")
        return jsonify({'error': 'Failed to delete task'}), 500


@app.route('/tasks/completed', methods=['DELETE'])
@rate_limit
def delete_completed_tasks():
    """
    Bulk delete all completed tasks.
    
    Returns:
        200: Success with count of deleted tasks
    """
    try:
        deleted_count = service.delete_completed_tasks()
        return jsonify({
            'message': f'Deleted {deleted_count} completed tasks',
            'count': deleted_count
        }), 200
        
    except Exception as e:
        app.logger.error(f"Error deleting completed tasks: {str(e)}")
        return jsonify({'error': 'Failed to delete completed tasks'}), 500


if __name__ == '__main__':
    # Development server only
    app.run(debug=True, host='0.0.0.0', port=5000)