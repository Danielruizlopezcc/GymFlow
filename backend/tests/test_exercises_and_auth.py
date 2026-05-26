"""
Backend API Tests for GymFlow App
Tests exercise endpoints (public) and auth endpoints
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('EXPO_PUBLIC_BACKEND_URL', '').rstrip('/')

class TestHealth:
    """Health check endpoint tests"""
    
    def test_health_endpoint_returns_ok(self):
        """Test /api/health returns status ok"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "status" in data, "Response missing 'status' field"
        assert data["status"] == "ok", f"Expected status 'ok', got {data['status']}"
        print(f"✓ Health check passed: {data}")
    
    def test_health_endpoint_returns_exercises_count(self):
        """Test /api/health returns exercises_count"""
        response = requests.get(f"{BASE_URL}/api/health")
        assert response.status_code == 200
        
        data = response.json()
        assert "exercises_count" in data, "Response missing 'exercises_count' field"
        assert isinstance(data["exercises_count"], int), "exercises_count should be an integer"
        assert data["exercises_count"] > 0, "exercises_count should be greater than 0"
        print(f"✓ Exercises count: {data['exercises_count']}")


class TestExercises:
    """Exercise endpoints tests"""
    
    def test_list_all_exercises(self):
        """Test GET /api/exercises returns list of exercises"""
        response = requests.get(f"{BASE_URL}/api/exercises")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert "exercises" in data, "Response missing 'exercises' field"
        assert "total" in data, "Response missing 'total' field"
        assert isinstance(data["exercises"], list), "exercises should be a list"
        assert len(data["exercises"]) > 0, "Should return at least one exercise"
        
        # Verify exercise structure
        first_exercise = data["exercises"][0]
        required_fields = ["exercise_id", "name", "body_part", "target", "equipment", "primary_muscles", "secondary_muscles"]
        for field in required_fields:
            assert field in first_exercise, f"Exercise missing required field: {field}"
        
        print(f"✓ Listed {len(data['exercises'])} exercises, total: {data['total']}")
    
    def test_filter_exercises_by_body_part_chest(self):
        """Test GET /api/exercises?body_part=chest filters correctly"""
        response = requests.get(f"{BASE_URL}/api/exercises?body_part=chest")
        assert response.status_code == 200
        
        data = response.json()
        assert "exercises" in data
        assert len(data["exercises"]) > 0, "Should return chest exercises"
        
        # Verify all returned exercises are chest exercises
        for exercise in data["exercises"]:
            assert exercise["body_part"] == "chest", f"Expected chest, got {exercise['body_part']}"
        
        print(f"✓ Filtered {len(data['exercises'])} chest exercises")
    
    def test_search_exercises_by_name(self):
        """Test GET /api/exercises?search=bench searches by name"""
        response = requests.get(f"{BASE_URL}/api/exercises?search=bench")
        assert response.status_code == 200
        
        data = response.json()
        assert "exercises" in data
        assert len(data["exercises"]) > 0, "Should return exercises matching 'bench'"
        
        # Verify all returned exercises contain 'bench' in name (case insensitive)
        for exercise in data["exercises"]:
            assert "bench" in exercise["name"].lower(), f"Exercise name '{exercise['name']}' doesn't contain 'bench'"
        
        print(f"✓ Found {len(data['exercises'])} exercises matching 'bench'")
    
    def test_get_body_parts_list(self):
        """Test GET /api/exercises/body-parts returns list of body parts"""
        response = requests.get(f"{BASE_URL}/api/exercises/body-parts")
        assert response.status_code == 200
        
        data = response.json()
        assert "body_parts" in data, "Response missing 'body_parts' field"
        assert isinstance(data["body_parts"], list), "body_parts should be a list"
        assert len(data["body_parts"]) > 0, "Should return at least one body part"
        
        # Check for expected body parts
        expected_parts = ["chest", "back", "shoulders", "upper arms", "upper legs"]
        for part in expected_parts:
            assert part in data["body_parts"], f"Missing expected body part: {part}"
        
        print(f"✓ Found {len(data['body_parts'])} body parts: {data['body_parts']}")
    
    def test_get_targets_list(self):
        """Test GET /api/exercises/targets returns list of targets"""
        response = requests.get(f"{BASE_URL}/api/exercises/targets")
        assert response.status_code == 200
        
        data = response.json()
        assert "targets" in data, "Response missing 'targets' field"
        assert isinstance(data["targets"], list), "targets should be a list"
        assert len(data["targets"]) > 0, "Should return at least one target"
        
        print(f"✓ Found {len(data['targets'])} targets")
    
    def test_get_single_exercise_detail(self):
        """Test GET /api/exercises/barbell-bench-press returns exercise detail"""
        exercise_id = "barbell-bench-press"
        response = requests.get(f"{BASE_URL}/api/exercises/{exercise_id}")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        
        data = response.json()
        assert data["exercise_id"] == exercise_id, f"Expected exercise_id {exercise_id}, got {data['exercise_id']}"
        assert "name" in data
        assert "body_part" in data
        assert "target" in data
        assert "equipment" in data
        assert "primary_muscles" in data
        assert "secondary_muscles" in data
        assert "instructions" in data
        
        # Verify instructions is a list
        assert isinstance(data["instructions"], list), "instructions should be a list"
        assert len(data["instructions"]) > 0, "instructions should not be empty"
        
        print(f"✓ Retrieved exercise: {data['name']}")
    
    def test_get_similar_exercises(self):
        """Test GET /api/exercises/barbell-bench-press/similar returns similar exercises"""
        exercise_id = "barbell-bench-press"
        response = requests.get(f"{BASE_URL}/api/exercises/{exercise_id}/similar")
        assert response.status_code == 200
        
        data = response.json()
        assert "similar" in data, "Response missing 'similar' field"
        assert isinstance(data["similar"], list), "similar should be a list"
        
        # Verify similar exercises have required fields
        if len(data["similar"]) > 0:
            first_similar = data["similar"][0]
            assert "exercise_id" in first_similar
            assert "name" in first_similar
            assert "body_part" in first_similar
            
            # Verify similar exercise is not the same as original
            assert first_similar["exercise_id"] != exercise_id, "Similar exercise should not be the same as original"
        
        print(f"✓ Found {len(data['similar'])} similar exercises")
    
    def test_get_nonexistent_exercise_returns_404(self):
        """Test GET /api/exercises/nonexistent returns 404"""
        response = requests.get(f"{BASE_URL}/api/exercises/nonexistent-exercise-id")
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        
        data = response.json()
        assert "error" in data, "Error response should contain 'error' field"
        print(f"✓ Correctly returned 404 for nonexistent exercise")


class TestAuth:
    """Authentication endpoint tests"""
    
    def test_auth_session_with_invalid_session_id(self):
        """Test POST /api/auth/session with invalid session_id returns 401"""
        response = requests.post(
            f"{BASE_URL}/api/auth/session",
            json={"session_id": "invalid-session-id-12345"}
        )
        # Should return 401 for invalid session
        assert response.status_code in [401, 500], f"Expected 401 or 500, got {response.status_code}"
        
        data = response.json()
        assert "error" in data, "Error response should contain 'error' field"
        print(f"✓ Invalid session correctly rejected with status {response.status_code}")
    
    def test_auth_me_without_token_returns_401(self):
        """Test GET /api/auth/me without auth token returns 401"""
        response = requests.get(f"{BASE_URL}/api/auth/me")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        
        data = response.json()
        assert "error" in data, "Error response should contain 'error' field"
        assert data["error"] == "Unauthorized", f"Expected 'Unauthorized', got {data['error']}"
        print(f"✓ Correctly returned 401 for missing auth token")
    
    def test_auth_me_with_invalid_token_returns_401(self):
        """Test GET /api/auth/me with invalid token returns 401"""
        response = requests.get(
            f"{BASE_URL}/api/auth/me",
            headers={"Authorization": "Bearer invalid-token-12345"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        
        data = response.json()
        assert "error" in data
        print(f"✓ Correctly returned 401 for invalid auth token")


@pytest.fixture
def api_client():
    """Shared requests session"""
    session = requests.Session()
    session.headers.update({"Content-Type": "application/json"})
    return session
