# Import required libraries for FastAPI web framework
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
from typing import Optional, Literal
import uuid
from datetime import date, time
import json
from datetime import datetime

# Initialize FastAPI application with metadata
app = FastAPI(title="Chained Form API", version="1.0.0")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the data model for form submissions using Pydantic
# This ensures data validation and automatic type conversion
class FormSubmission(BaseModel):
    # Step 1: User must choose either Basic or Advanced mode
    mode: Literal["Basic", "Advanced"]
    
    # Step 2: Fields that are mutually exclusive based on the chosen mode
    # - Basic mode requires a topic (free text)
    # - Advanced mode requires a category (predefined options)
    topic: Optional[str] = None
    category: Optional[Literal["Schedule", "Realtime", "Analytics"]] = None
    
    # Step 3: Date/time fields that are mutually exclusive
    # - choose_date: for scheduling tasks
    # - choose_time: for real-time operations
    choose_date: Optional[date] = None
    choose_time: Optional[time] = None
    
    # Step 4: Budget/urgency fields that are mutually exclusive based on step 3
    # - budget: required when on date path (scheduling)
    # - urgency: required when on time path (real-time)
    budget: Optional[int] = None
    urgency: Optional[Literal["Low", "Normal", "High"]] = None

    def validate_form_logic(self):
        """
        Custom validation method that implements the chained form logic
        This ensures that the form follows the business rules across all steps
        """
        errors = []
        
        # Step 2 validation: Ensure appropriate field is filled based on mode
        if self.mode == 'Basic' and not self.topic:
            errors.append('Topic is required for Basic mode')
        elif self.mode == 'Advanced' and not self.category:
            errors.append('Category is required for Advanced mode')
        
        # Step 3 validation: Ensure date/time is provided based on context
        if self.mode == 'Basic' and self.topic:
            # For Basic mode, check if topic contains "date" to determine path
            if 'date' in self.topic.lower():
                if not self.choose_date:
                    errors.append('Date is required when topic contains "date"')
            else:
                if not self.choose_time:
                    errors.append('Time is required when topic does not contain "date"')
        elif self.mode == 'Advanced' and self.category:
            # For Advanced mode, use category to determine path
            if self.category == 'Schedule':
                if not self.choose_date:
                    errors.append('Date is required for Schedule category')
            elif self.category in ['Realtime', 'Analytics']:
                if not self.choose_time:
                    errors.append('Time is required for Realtime and Analytics categories')
        
        # Step 4 validation: Ensure budget/urgency is provided based on path
        # Determine if we're on the "date path" (scheduling) or "time path" (real-time)
        is_date_path = (
            (self.mode == 'Basic' and self.topic and 'date' in self.topic.lower()) or
            (self.mode == 'Advanced' and self.category == 'Schedule')
        )
        
        if is_date_path and self.budget is None:
            errors.append('Budget is required when on date path')
        elif not is_date_path and not self.urgency:
            errors.append('Urgency is required when on time path')
        
        # If any validation errors occurred, raise an exception
        if errors:
            raise ValueError('; '.join(errors))

    # Field validators using Pydantic decorators
    # These run automatically when data is processed
    
    @field_validator('topic')
    @classmethod
    def validate_topic(cls, v, info):
        """Validate that topic is provided for Basic mode"""
        if info.data.get('mode') == 'Basic' and not v:
            raise ValueError('Topic is required for Basic mode')
        return v

    @field_validator('category')
    @classmethod
    def validate_category(cls, v, info):
        """Validate that category is provided for Advanced mode"""
        if info.data.get('mode') == 'Advanced' and not v:
            raise ValueError('Category is required for Advanced mode')
        return v

    @field_validator('choose_date')
    @classmethod
    def validate_choose_date(cls, v, info):
        """Validate date field based on mode and context"""
        if info.data.get('mode') == 'Basic':
            topic = info.data.get('topic', '')
            if topic and 'date' in topic.lower() and not v:
                raise ValueError('Date is required when topic contains "date"')
        elif info.data.get('mode') == 'Advanced':
            category = info.data.get('category')
            if category == 'Schedule' and not v:
                raise ValueError('Date is required for Schedule category')
        return v

    @field_validator('choose_time')
    @classmethod
    def validate_choose_time(cls, v, info):
        """Validate time field based on mode and context"""
        if info.data.get('mode') == 'Basic':
            topic = info.data.get('topic', '')
            if topic and 'date' not in topic.lower() and not v:
                raise ValueError('Time is required when topic does not contain "date"')
        elif info.data.get('mode') == 'Advanced':
            category = info.data.get('category')
            if category in ['Realtime', 'Analytics'] and not v:
                raise ValueError('Time is required for Realtime and Analytics categories')
        return v

    @field_validator('budget')
    @classmethod
    def validate_budget(cls, v, info):
        """Validate budget constraints"""
        if v is not None:
            if not isinstance(v, int):
                raise ValueError('Budget must be an integer')
            if v < 0 or v > 5000:
                raise ValueError('Budget must be between 0 and 5000')
            if v % 100 != 0:
                raise ValueError('Budget must be a multiple of 100')
        return v

    @field_validator('urgency')
    @classmethod
    def validate_urgency(cls, v, info):
        """Validate urgency is one of the allowed values"""
        if v is not None and v not in ['Low', 'Normal', 'High']:
            raise ValueError('Urgency must be one of: Low, Normal, High')
        return v

# Response model for the submit endpoint
class SubmitResponse(BaseModel):
    status: str  # Success status
    id: str      # Unique submission ID

# API endpoint to handle form submissions
@app.post("/api/submit", response_model=SubmitResponse)
async def submit_form(form_data: FormSubmission):
    """
    Handle form submissions with validation
    
    This endpoint:
    1. Validates the form data using business logic
    2. Generates a unique ID for the submission
    3. Returns a success response with the submission ID
    """
    try:
        # Step 1: Validate the form logic using our custom validation
        form_data.validate_form_logic()
        
        # Step 2: Generate a unique identifier for this submission
        submission_id = str(uuid.uuid4())
        
        # Step 3: Log the submission data
        submission_data = {
            "id": submission_id,
            "timestamp": datetime.now().isoformat(),
            "form_data": form_data.model_dump()
        }
        
        print(f"Form submission received: {submission_data}")
        
        # Step 4: Return success response
        return SubmitResponse(status="ok", id=submission_id)
    
    except ValueError as e:
        # Handle validation errors (422 Unprocessable Entity)
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        # Handle any other unexpected errors (500 Internal Server Error)
        print(f"Server error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Health check endpoint
@app.get("/")
async def root():
    """Simple health check endpoint to verify API is running"""
    return {"message": "Chained Form API is running"}

if __name__ == "__main__":
    import uvicorn
    # Start the FastAPI server with uvicorn
    # host="0.0.0.0" allows connections from any IP address
    # port=8001 to avoid potential conflicts
    uvicorn.run(app, host="0.0.0.0", port=8001)
