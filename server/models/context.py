from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class SportConfig(BaseModel):
    sport_id: str
    name: str
    theme_color: str
    skills: List[str]
    attributes: Dict[str, str]
    equipment_schema: Dict[str, Any]

class UserSportState(BaseModel):
    """
    Represents the user's relationship with a specific sport.
    Found in 'user_sports' table.
    """
    sport_id: str
    skill_level: str
    joined_at: datetime
    profile_data: Dict[str, Any] = {}

class UserContext(BaseModel):
    """
    The main context object loaded when a user opens the app.
    Determines which UI to show based on 'current_sport_id'.
    """
    user_id: str
    username: Optional[str] = None
    
    # Critical for the "Single Active Sport" UI
    current_sport_id: Optional[str] = None
    
    # If current_sport_id is set, this contains the config for that sport
    active_sport_config: Optional[SportConfig] = None
    
    # If current_sport_id is set, this contains the user's specific stats
    active_sport_state: Optional[UserSportState] = None

    def is_onboarded(self) -> bool:
        return self.current_sport_id is not None
