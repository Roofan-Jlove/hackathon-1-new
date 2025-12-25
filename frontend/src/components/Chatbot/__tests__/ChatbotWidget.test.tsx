import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatbotWidget from '../ChatbotWidget';

// We will mock the global fetch function
global.fetch = jest.fn();

const mockFetch = global.fetch as jest.Mock;

describe('ChatbotWidget', () => {
  beforeEach(() => {
    // Clear mock history and reset implementation before each test
    mockFetch.mockClear();
    // Default mock response
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        answer: 'Mocked bot response',
        sources: [],
        conversation_id: '123-abc',
      }),
    });
  });

  it('renders collapsed by default', () => {
    render(<ChatbotWidget />);
    expect(screen.getByText('Book Assistant')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Ask about the book content...')).not.toBeInTheDocument();
  });

  it('expands when the header is clicked', () => {
    render(<ChatbotWidget />);
    const header = screen.getByText('Book Assistant');
    fireEvent.click(header);
    expect(screen.getByPlaceholderText('Ask about the book content...')).toBeInTheDocument();
  });

  it('sends a message and displays the bot response', async () => {
    render(<ChatbotWidget />);
    
    // Open the chatbot
    fireEvent.click(screen.getByText('Book Assistant'));
    
    const input = screen.getByPlaceholderText('Ask about the book content...');
    const sendButton = screen.getByText('Send');

    // Type a message and send it
    fireEvent.change(input, { target: { value: 'Test question' } });
    fireEvent.click(sendButton);

    // Check that the user's message appears
    expect(await screen.findByText('Test question')).toBeInTheDocument();

    // Check that fetch was called correctly
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/chat'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          question: 'Test question',
          context: undefined,
          conversation_id: undefined,
        }),
      })
    );

    // Check that the bot's response appears
    await waitFor(() => {
      expect(screen.getByText('Mocked bot response')).toBeInTheDocument();
    });
  });

  it('displays an error message if the fetch call fails', async () => {
    // Override the default mock to simulate a network error
    mockFetch.mockRejectedValue(new Error('Network failure'));

    render(<ChatbotWidget />);
    fireEvent.click(screen.getByText('Book Assistant')); // Open chatbot
    
    const input = screen.getByPlaceholderText('Ask about the book content...');
    fireEvent.change(input, { target: { value: 'A question that will fail' } });
    fireEvent.click(screen.getByText('Send'));

    // Wait for the error message to be displayed
    await waitFor(() => {
      expect(screen.getByText('Error: Network failure')).toBeInTheDocument();
    });
  });

  it('sends selected text as context', async () => {
    // Mock window.getSelection
    const mockSelection = {
      toString: () => 'This is some selected text.',
    };
    Object.defineProperty(window, 'getSelection', {
      value: () => mockSelection,
      writable: true,
    });

    render(<ChatbotWidget />);

    // Trigger a mouseup to simulate text selection
    fireEvent.mouseUp(document);

    // Open the chatbot
    fireEvent.click(screen.getByText('Book Assistant'));

    // Check if the notice for selected text appears
    expect(await screen.findByText(/Selected for context:/)).toBeInTheDocument();
    expect(screen.getByText(/"This is some selected text."/)).toBeInTheDocument();

    // Send a message
    const input = screen.getByPlaceholderText('Ask about the book content...');
    fireEvent.change(input, { target: { value: 'What about this?' } });
    fireEvent.click(screen.getByText('Send'));
    
    // Check that fetch was called with the correct context
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/chat'),
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          question: 'What about this?',
          context: 'This is some selected text.',
          conversation_id: undefined,
        }),
      })
    );
  });
});
