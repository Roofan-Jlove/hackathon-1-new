#!/bin/bash

# Auth Feature Management Skill
# Provides commands for testing and managing authentication

set -e

BACKEND_URL="${BACKEND_URL:-http://localhost:8000}"
FRONTEND_URL="${FRONTEND_URL:-http://localhost:3000}"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Command: check-servers
check_servers() {
    print_info "Checking servers..."
    echo ""

    # Check backend
    if curl -s -f "$BACKEND_URL/health" > /dev/null 2>&1; then
        print_success "Backend is running at $BACKEND_URL"
        BACKEND_STATUS=$(curl -s "$BACKEND_URL/health")
        echo "  Response: $BACKEND_STATUS"
    else
        print_error "Backend is not responding at $BACKEND_URL"
        echo "  Start with: cd backend && uvicorn app.main:app --reload"
        return 1
    fi

    echo ""

    # Check frontend
    if curl -s -f "$FRONTEND_URL" > /dev/null 2>&1; then
        print_success "Frontend is running at $FRONTEND_URL"
    else
        print_error "Frontend is not responding at $FRONTEND_URL"
        echo "  Start with: cd frontend && npm start"
        return 1
    fi

    echo ""
    print_success "All servers are operational!"
}

# Command: create-test-user
create_test_user() {
    local level="${1:-intermediate}"
    local timestamp=$(date +%s)
    local email="test-${level}-${timestamp}@test.com"
    local password="Test1234"

    print_info "Creating $level test user..."

    # Determine profile based on level
    local profile=""
    case $level in
        beginner)
            profile='{
                "programming_experience": "beginner",
                "python_proficiency": "basic",
                "ros_experience": "never_heard",
                "ai_ml_experience": "none",
                "robotics_hardware_experience": "none",
                "primary_interests": ["autonomous_navigation"]
            }'
            ;;
        intermediate)
            profile='{
                "programming_experience": "intermediate",
                "python_proficiency": "intermediate",
                "ros_experience": "beginner",
                "ai_ml_experience": "pretrained",
                "robotics_hardware_experience": "hobbyist",
                "primary_interests": ["computer_vision", "simulation"]
            }'
            ;;
        advanced)
            profile='{
                "programming_experience": "expert",
                "python_proficiency": "advanced",
                "ros_experience": "advanced",
                "ai_ml_experience": "production",
                "robotics_hardware_experience": "research",
                "primary_interests": ["physical_ai", "manipulation"]
            }'
            ;;
        *)
            print_error "Invalid level. Use: beginner, intermediate, or advanced"
            return 1
            ;;
    esac

    # Create user
    local response=$(curl -s -X POST "$BACKEND_URL/api/auth/signup" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"$password\",\"profile\":$profile}")

    if echo "$response" | grep -q "token"; then
        local token=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
        print_success "User created successfully!"
        echo ""
        echo "Email: $email"
        echo "Password: $password"
        echo "Token: ${token:0:50}..."
        echo ""
        echo "Save these credentials for testing!"
    else
        print_error "Failed to create user"
        echo "$response"
        return 1
    fi
}

# Command: test-auth
test_auth() {
    print_info "Running authentication test suite..."
    echo ""

    # Test 1: Check servers
    print_info "[1/5] Checking servers..."
    if ! check_servers; then
        print_error "Server check failed. Aborting tests."
        return 1
    fi
    echo ""

    # Test 2: Test signup
    print_info "[2/5] Testing signup endpoint..."
    local test_email="test-$(date +%s)@test.com"
    local signup_response=$(curl -s -X POST "$BACKEND_URL/api/auth/signup" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$test_email\",\"password\":\"Test1234\"}")

    if echo "$signup_response" | grep -q "token"; then
        print_success "Signup test passed"
        local test_token=$(echo "$signup_response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    else
        print_error "Signup test failed"
        return 1
    fi
    echo ""

    # Test 3: Test signin
    print_info "[3/5] Testing signin endpoint..."
    local signin_response=$(curl -s -X POST "$BACKEND_URL/api/auth/signin" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$test_email\",\"password\":\"Test1234\"}")

    if echo "$signin_response" | grep -q "token"; then
        print_success "Signin test passed"
    else
        print_error "Signin test failed"
        return 1
    fi
    echo ""

    # Test 4: Test protected endpoint
    print_info "[4/5] Testing protected endpoint..."
    local me_response=$(curl -s -X GET "$BACKEND_URL/api/auth/me" \
        -H "Authorization: Bearer $test_token")

    if echo "$me_response" | grep -q "$test_email"; then
        print_success "Protected endpoint test passed"
    else
        print_error "Protected endpoint test failed"
        return 1
    fi
    echo ""

    # Test 5: Test profile creation
    print_info "[5/5] Testing profile endpoint..."
    local profile_response=$(curl -s -X POST "$BACKEND_URL/api/profile" \
        -H "Authorization: Bearer $test_token" \
        -H "Content-Type: application/json" \
        -d '{"programming_experience":"intermediate","python_proficiency":"advanced"}')

    if echo "$profile_response" | grep -q "programming_experience"; then
        print_success "Profile creation test passed"
    else
        print_error "Profile creation test failed"
        return 1
    fi
    echo ""

    print_success "All authentication tests passed! ✨"
}

# Command: test-personalization
test_personalization() {
    local question="${1:-What is ROS?}"

    print_info "Testing personalization with question: '$question'"
    echo ""

    # Create beginner and advanced users
    print_info "Creating test users..."
    local beginner_email="test-beginner-$(date +%s)@test.com"
    local advanced_email="test-advanced-$(date +%s)@test.com"

    # Create beginner user
    local beginner_resp=$(curl -s -X POST "$BACKEND_URL/api/auth/signup" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$beginner_email\",\"password\":\"Test1234\",\"profile\":{\"programming_experience\":\"beginner\",\"python_proficiency\":\"basic\",\"ros_experience\":\"never_heard\"}}")
    local beginner_token=$(echo "$beginner_resp" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

    # Create advanced user
    local advanced_resp=$(curl -s -X POST "$BACKEND_URL/api/auth/signup" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$advanced_email\",\"password\":\"Test1234\",\"profile\":{\"programming_experience\":\"expert\",\"python_proficiency\":\"advanced\",\"ros_experience\":\"advanced\"}}")
    local advanced_token=$(echo "$advanced_resp" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

    echo ""

    # Test anonymous response
    print_info "Getting anonymous response..."
    local anon_response=$(curl -s -X POST "$BACKEND_URL/api/chat" \
        -H "Content-Type: application/json" \
        -d "{\"question\":\"$question\"}")
    local anon_answer=$(echo "$anon_response" | grep -o '"answer":"[^"]*' | cut -d'"' -f4 | head -c 200)

    echo "Anonymous (Intermediate): ${anon_answer}..."
    echo ""

    # Test beginner response
    print_info "Getting beginner response..."
    local beginner_response=$(curl -s -X POST "$BACKEND_URL/api/chat" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $beginner_token" \
        -d "{\"question\":\"$question\"}")
    local beginner_answer=$(echo "$beginner_response" | grep -o '"answer":"[^"]*' | cut -d'"' -f4 | head -c 200)

    echo "Beginner Level: ${beginner_answer}..."
    echo ""

    # Test advanced response
    print_info "Getting advanced response..."
    local advanced_response=$(curl -s -X POST "$BACKEND_URL/api/chat" \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer $advanced_token" \
        -d "{\"question\":\"$question\"}")
    local advanced_answer=$(echo "$advanced_response" | grep -o '"answer":"[^"]*' | cut -d'"' -f4 | head -c 200)

    echo "Advanced Level: ${advanced_answer}..."
    echo ""

    print_success "Personalization test complete!"
    print_info "Compare the responses above to see personalization in action."
}

# Command: verify-profile
verify_profile() {
    local email="${1}"

    if [ -z "$email" ]; then
        print_error "Please provide an email address"
        echo "Usage: /auth verify-profile <email>"
        return 1
    fi

    print_info "Verifying profile for: $email"
    echo ""

    # First, sign in to get token
    local signin_response=$(curl -s -X POST "$BACKEND_URL/api/auth/signin" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$email\",\"password\":\"Test1234\"}")

    if ! echo "$signin_response" | grep -q "token"; then
        print_error "Could not sign in with provided email"
        return 1
    fi

    local token=$(echo "$signin_response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)

    # Get profile
    local profile_response=$(curl -s -X GET "$BACKEND_URL/api/profile" \
        -H "Authorization: Bearer $token")

    if echo "$profile_response" | grep -q "programming_experience"; then
        print_success "Profile found!"
        echo ""
        echo "$profile_response" | python3 -m json.tool 2>/dev/null || echo "$profile_response"
    else
        print_warning "No profile found for this user"
        echo "User may need to complete the profile questionnaire"
    fi
}

# Main command router
case "${1:-help}" in
    check-servers)
        check_servers
        ;;
    create-test-user)
        create_test_user "${2:-intermediate}"
        ;;
    test-auth)
        test_auth
        ;;
    test-personalization)
        test_personalization "${2}"
        ;;
    verify-profile)
        verify_profile "${2}"
        ;;
    help|*)
        echo "Auth Feature Management Skill"
        echo ""
        echo "Available commands:"
        echo "  check-servers              Check if backend and frontend are running"
        echo "  create-test-user [level]   Create a test user (beginner|intermediate|advanced)"
        echo "  test-auth                  Run complete auth test suite"
        echo "  test-personalization [q]   Test personalization with different user levels"
        echo "  verify-profile <email>     Verify a user's profile setup"
        echo ""
        echo "Examples:"
        echo "  /auth check-servers"
        echo "  /auth create-test-user beginner"
        echo "  /auth test-auth"
        echo "  /auth test-personalization \"What is ROS?\""
        echo "  /auth verify-profile test@example.com"
        echo ""
        echo "For more details, see .claude/skills/auth.md"
        ;;
esac
