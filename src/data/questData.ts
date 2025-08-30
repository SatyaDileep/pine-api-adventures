export interface Quest {
  id: string;
  title: string;
  objective: string;
  description: string;
  codeSnippet: string;
  expectedOutput: string;
  xpReward: number;
  difficulty: "Easy" | "Medium" | "Hard";
  language: string;
  validationEndpoint?: string;
}

export const questData: Record<string, Quest[]> = {
  python: [
    {
      id: "python-setup",
      title: "Environment Setup",
      objective: "Initialize your Python environment for Pine Labs API integration",
      description: "First, let's set up your development environment. Install the required packages and configure your API credentials. This quest will teach you the foundations of working with Pine Labs Online APIs.",
      codeSnippet: `import requests
import json
import os
from datetime import datetime

# Pine Labs Sandbox Configuration
BASE_URL = "https://sandbox-api.pinelabs.com"
API_KEY = "your_sandbox_api_key"
MERCHANT_ID = "your_merchant_id"

# Initialize headers for API requests
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer {API_KEY}",
    "X-Merchant-ID": MERCHANT_ID
}

print("Pine Labs Python SDK Initialized!")
print(f"Base URL: {BASE_URL}")
print(f"Timestamp: {datetime.now().isoformat()}")`,
      expectedOutput: `Pine Labs Python SDK Initialized!
Base URL: https://sandbox-api.pinelabs.com
Timestamp: 2024-01-15T10:30:45.123456`,
      xpReward: 100,
      difficulty: "Easy",
      language: "Python"
    },
    {
      id: "python-auth",
      title: "Authentication Token",
      objective: "Generate authentication token for secure API access",
      description: "Learn how to authenticate with Pine Labs Online APIs. You'll generate an access token that will be used for subsequent API calls. This is a crucial security step in payment processing.",
      codeSnippet: `def generate_auth_token():
    """Generate authentication token for Pine Labs API"""
    
    auth_payload = {
        "merchant_id": MERCHANT_ID,
        "api_key": API_KEY,
        "timestamp": datetime.now().isoformat()
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/auth/token",
            headers=headers,
            json=auth_payload,
            timeout=30
        )
        
        if response.status_code == 200:
            token_data = response.json()
            access_token = token_data.get("access_token")
            expires_in = token_data.get("expires_in")
            
            print(f"✅ Authentication successful!")
            print(f"Access Token: {access_token[:20]}...")
            print(f"Expires in: {expires_in} seconds")
            
            return access_token
        else:
            print(f"❌ Authentication failed: {response.status_code}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {str(e)}")
        return None

# Generate token
token = generate_auth_token()`,
      expectedOutput: `✅ Authentication successful!
Access Token: eyJhbGciOiJIUzI1NiIsInR5...
Expires in: 3600 seconds`,
      xpReward: 200,
      difficulty: "Medium",
      language: "Python"
    },
    {
      id: "python-payment",
      title: "Create Payment",
      objective: "Process your first payment transaction",
      description: "Now for the main event! Create a payment transaction using the Pine Labs Online API. You'll learn how to structure payment requests, handle responses, and process transaction data.",
      codeSnippet: `def create_payment(access_token, amount, currency="INR"):
    """Create a payment transaction"""
    
    payment_payload = {
        "amount": amount,
        "currency": currency,
        "merchant_reference": f"TXN_{int(datetime.now().timestamp())}",
        "description": "Integration Quest Payment",
        "callback_url": "https://your-app.com/callback",
        "customer": {
            "email": "developer@example.com",
            "phone": "+919876543210",
            "name": "Quest Developer"
        }
    }
    
    auth_headers = {
        **headers,
        "Authorization": f"Bearer {access_token}"
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/payments/create",
            headers=auth_headers,
            json=payment_payload,
            timeout=30
        )
        
        if response.status_code == 201:
            payment_data = response.json()
            
            print("🎉 Payment created successfully!")
            print(f"Transaction ID: {payment_data['transaction_id']}")
            print(f"Payment URL: {payment_data['payment_url']}")
            print(f"Status: {payment_data['status']}")
            print(f"Amount: ₹{payment_data['amount']}")
            
            return payment_data
        else:
            print(f"❌ Payment creation failed: {response.status_code}")
            return None
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Request failed: {str(e)}")
        return None

# Create a test payment
payment = create_payment(token, 100.00)`,
      expectedOutput: `🎉 Payment created successfully!
Transaction ID: TXN_1705234567890
Payment URL: https://sandbox-checkout.pinelabs.com/pay/abc123def456
Status: pending
Amount: ₹100.0`,
      xpReward: 300,
      difficulty: "Hard",
      language: "Python"
    }
  ],
  nodejs: [
    {
      id: "nodejs-setup",
      title: "Node.js Environment Setup",
      objective: "Configure your Node.js project for Pine Labs integration",
      description: "Set up your Node.js environment with the necessary dependencies. Learn how to structure your project and configure the Pine Labs SDK for seamless API integration.",
      codeSnippet: `const axios = require('axios');
const crypto = require('crypto');

// Pine Labs Sandbox Configuration
const config = {
    baseURL: 'https://sandbox-api.pinelabs.com',
    apiKey: 'your_sandbox_api_key',
    merchantId: 'your_merchant_id',
    timeout: 30000
};

// Create axios instance with default config
const pineLabsAPI = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${config.apiKey}\`,
        'X-Merchant-ID': config.merchantId
    }
});

console.log('🚀 Pine Labs Node.js SDK Initialized!');
console.log('Base URL:', config.baseURL);
console.log('Timestamp:', new Date().toISOString());`,
      expectedOutput: `🚀 Pine Labs Node.js SDK Initialized!
Base URL: https://sandbox-api.pinelabs.com
Timestamp: 2024-01-15T10:30:45.123Z`,
      xpReward: 100,
      difficulty: "Easy",
      language: "Node.js"
    },
    {
      id: "nodejs-auth",
      title: "Token Authentication",
      objective: "Implement secure token-based authentication",
      description: "Create a robust authentication system using async/await patterns. Learn how to handle authentication errors and implement token refresh mechanisms for production-ready applications.",
      codeSnippet: `async function generateAuthToken() {
    try {
        const authPayload = {
            merchant_id: config.merchantId,
            api_key: config.apiKey,
            timestamp: new Date().toISOString()
        };

        const response = await pineLabsAPI.post('/auth/token', authPayload);
        
        const { access_token, expires_in, token_type } = response.data;
        
        console.log('✅ Authentication successful!');
        console.log(\`Access Token: \${access_token.substring(0, 20)}...\`);
        console.log(\`Token Type: \${token_type}\`);
        console.log(\`Expires in: \${expires_in} seconds\`);
        
        // Update axios instance with new token
        pineLabsAPI.defaults.headers.Authorization = \`Bearer \${access_token}\`;
        
        return {
            token: access_token,
            expiresIn: expires_in,
            expiresAt: Date.now() + (expires_in * 1000)
        };
        
    } catch (error) {
        console.error('❌ Authentication failed:', error.response?.data || error.message);
        throw error;
    }
}

// Generate authentication token
generateAuthToken()
    .then(tokenData => {
        console.log('Token generated successfully:', tokenData);
    })
    .catch(error => {
        console.error('Failed to generate token:', error);
    });`,
      expectedOutput: `✅ Authentication successful!
Access Token: eyJhbGciOiJIUzI1NiIsInR5...
Token Type: Bearer
Expires in: 3600 seconds
Token generated successfully: {
  token: "eyJhbGciOiJIUzI1NiIsInR5...",
  expiresIn: 3600,
  expiresAt: 1705238167890
}`,
      xpReward: 200,
      difficulty: "Medium",
      language: "Node.js"
    },
    {
      id: "nodejs-payment",
      title: "Payment Processing",
      objective: "Implement complete payment workflow with error handling",
      description: "Master the art of payment processing with comprehensive error handling, validation, and response processing. This quest covers real-world payment scenarios you'll encounter in production.",
      codeSnippet: `async function createPayment(amount, currency = 'INR') {
    try {
        const merchantReference = \`TXN_\${Date.now()}\`;
        
        const paymentPayload = {
            amount: parseFloat(amount),
            currency,
            merchant_reference: merchantReference,
            description: 'Integration Quest Payment - Node.js',
            callback_url: 'https://your-app.com/payment/callback',
            redirect_url: 'https://your-app.com/payment/success',
            webhook_url: 'https://your-app.com/webhook/payment',
            customer: {
                email: 'developer@example.com',
                phone: '+919876543210',
                name: 'Quest Developer',
                address: {
                    line1: '123 Developer Street',
                    city: 'Bangalore',
                    state: 'Karnataka',
                    country: 'IN',
                    postal_code: '560001'
                }
            },
            metadata: {
                quest_id: 'nodejs-payment',
                integration_type: 'sandbox'
            }
        };

        console.log('💳 Creating payment...', { merchantReference, amount, currency });
        
        const response = await pineLabsAPI.post('/payments/create', paymentPayload);
        
        const paymentData = response.data;
        
        console.log('🎉 Payment created successfully!');
        console.log(\`Transaction ID: \${paymentData.transaction_id}\`);
        console.log(\`Payment URL: \${paymentData.payment_url}\`);
        console.log(\`Status: \${paymentData.status}\`);
        console.log(\`Amount: ₹\${paymentData.amount}\`);
        console.log(\`Reference: \${paymentData.merchant_reference}\`);
        
        return paymentData;
        
    } catch (error) {
        console.error('❌ Payment creation failed:');
        console.error('Status:', error.response?.status);
        console.error('Error:', error.response?.data || error.message);
        throw error;
    }
}

// Create a test payment
createPayment(250.00)
    .then(payment => {
        console.log('Payment workflow completed:', payment.transaction_id);
    })
    .catch(error => {
        console.error('Payment workflow failed:', error);
    });`,
      expectedOutput: `💳 Creating payment... { merchantReference: 'TXN_1705238167890', amount: 250, currency: 'INR' }
🎉 Payment created successfully!
Transaction ID: TXN_1705238167890
Payment URL: https://sandbox-checkout.pinelabs.com/pay/xyz789abc123
Status: pending
Amount: ₹250
Reference: TXN_1705238167890
Payment workflow completed: TXN_1705238167890`,
      xpReward: 300,
      difficulty: "Hard",
      language: "Node.js"
    }
  ],
  java: [
    {
      id: "java-setup",
      title: "Java SDK Configuration",
      objective: "Set up Java environment with Pine Labs SDK",
      description: "Configure your Java development environment for enterprise-grade payment processing. Learn about dependency management, configuration patterns, and best practices for Java applications.",
      codeSnippet: `import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.databind.ObjectMapper;

public class PineLabsSDK {
    private static final String BASE_URL = "https://sandbox-api.pinelabs.com";
    private static final String API_KEY = "your_sandbox_api_key";
    private static final String MERCHANT_ID = "your_merchant_id";
    
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;
    private String accessToken;
    
    public PineLabsSDK() {
        this.httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(30))
            .build();
        this.objectMapper = new ObjectMapper();
        
        System.out.println("🔧 Pine Labs Java SDK Initialized!");
        System.out.println("Base URL: " + BASE_URL);
        System.out.println("Merchant ID: " + MERCHANT_ID);
        System.out.println("Timestamp: " + Instant.now().toString());
    }
    
    public Map<String, String> getDefaultHeaders() {
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("X-Merchant-ID", MERCHANT_ID);
        if (accessToken != null) {
            headers.put("Authorization", "Bearer " + accessToken);
        }
        return headers;
    }
}

// Initialize SDK
PineLabsSDK sdk = new PineLabsSDK();`,
      expectedOutput: `🔧 Pine Labs Java SDK Initialized!
Base URL: https://sandbox-api.pinelabs.com
Merchant ID: your_merchant_id
Timestamp: 2024-01-15T10:30:45.123456Z`,
      xpReward: 100,
      difficulty: "Easy",
      language: "Java"
    },
    {
      id: "java-auth",
      title: "Authentication Service",
      objective: "Implement robust authentication with Java best practices",
      description: "Build a comprehensive authentication service using modern Java features. Learn about exception handling, HTTP clients, and secure token management in enterprise Java applications.",
      codeSnippet: `public class AuthenticationResult {
    private final String accessToken;
    private final int expiresIn;
    private final long expiresAt;
    
    public AuthenticationResult(String accessToken, int expiresIn) {
        this.accessToken = accessToken;
        this.expiresIn = expiresIn;
        this.expiresAt = System.currentTimeMillis() + (expiresIn * 1000L);
    }
    
    // Getters...
    public String getAccessToken() { return accessToken; }
    public boolean isExpired() { return System.currentTimeMillis() > expiresAt; }
}

public AuthenticationResult authenticate() throws Exception {
    try {
        // Prepare authentication payload
        Map<String, Object> authPayload = new HashMap<>();
        authPayload.put("merchant_id", MERCHANT_ID);
        authPayload.put("api_key", API_KEY);
        authPayload.put("timestamp", Instant.now().toString());
        
        String requestBody = objectMapper.writeValueAsString(authPayload);
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/auth/token"))
            .header("Content-Type", "application/json")
            .header("X-Merchant-ID", MERCHANT_ID)
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .timeout(Duration.ofSeconds(30))
            .build();
        
        HttpResponse<String> response = httpClient.send(request, 
            HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() == 200) {
            Map<String, Object> responseData = objectMapper.readValue(
                response.body(), HashMap.class);
            
            String token = (String) responseData.get("access_token");
            Integer expiresIn = (Integer) responseData.get("expires_in");
            
            this.accessToken = token;
            
            System.out.println("✅ Authentication successful!");
            System.out.println("Access Token: " + token.substring(0, 20) + "...");
            System.out.println("Expires in: " + expiresIn + " seconds");
            
            return new AuthenticationResult(token, expiresIn);
        } else {
            throw new RuntimeException("Authentication failed: " + response.statusCode());
        }
        
    } catch (Exception e) {
        System.err.println("❌ Authentication error: " + e.getMessage());
        throw e;
    }
}

// Authenticate
AuthenticationResult authResult = sdk.authenticate();`,
      expectedOutput: `✅ Authentication successful!
Access Token: eyJhbGciOiJIUzI1NiIsInR5...
Expires in: 3600 seconds`,
      xpReward: 200,
      difficulty: "Medium",
      language: "Java"
    },
    {
      id: "java-payment",
      title: "Enterprise Payment Processing",
      objective: "Implement production-ready payment processing",
      description: "Master enterprise-level payment processing with comprehensive validation, error handling, and logging. This quest demonstrates industry-standard Java patterns for financial applications.",
      codeSnippet: `public class PaymentRequest {
    private double amount;
    private String currency;
    private String merchantReference;
    private String description;
    private Customer customer;
    
    // Constructor and getters/setters...
    public PaymentRequest(double amount, String currency, Customer customer) {
        this.amount = amount;
        this.currency = currency;
        this.merchantReference = "TXN_" + System.currentTimeMillis();
        this.customer = customer;
    }
}

public class Customer {
    private String email;
    private String phone;
    private String name;
    
    public Customer(String email, String phone, String name) {
        this.email = email;
        this.phone = phone;
        this.name = name;
    }
}

public Map<String, Object> createPayment(PaymentRequest paymentRequest) throws Exception {
    try {
        // Validate authentication
        if (accessToken == null) {
            throw new IllegalStateException("Not authenticated. Call authenticate() first.");
        }
        
        // Prepare payment payload
        Map<String, Object> payload = new HashMap<>();
        payload.put("amount", paymentRequest.getAmount());
        payload.put("currency", paymentRequest.getCurrency());
        payload.put("merchant_reference", paymentRequest.getMerchantReference());
        payload.put("description", "Integration Quest Payment - Java Enterprise");
        payload.put("callback_url", "https://your-app.com/callback");
        
        Map<String, Object> customerData = new HashMap<>();
        customerData.put("email", paymentRequest.getCustomer().getEmail());
        customerData.put("phone", paymentRequest.getCustomer().getPhone());
        customerData.put("name", paymentRequest.getCustomer().getName());
        payload.put("customer", customerData);
        
        String requestBody = objectMapper.writeValueAsString(payload);
        
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create(BASE_URL + "/payments/create"))
            .header("Content-Type", "application/json")
            .header("Authorization", "Bearer " + accessToken)
            .header("X-Merchant-ID", MERCHANT_ID)
            .POST(HttpRequest.BodyPublishers.ofString(requestBody))
            .timeout(Duration.ofSeconds(30))
            .build();
        
        HttpResponse<String> response = httpClient.send(request,
            HttpResponse.BodyHandlers.ofString());
        
        if (response.statusCode() == 201) {
            Map<String, Object> paymentData = objectMapper.readValue(
                response.body(), HashMap.class);
            
            System.out.println("🎉 Payment created successfully!");
            System.out.println("Transaction ID: " + paymentData.get("transaction_id"));
            System.out.println("Payment URL: " + paymentData.get("payment_url"));
            System.out.println("Status: " + paymentData.get("status"));
            System.out.println("Amount: ₹" + paymentData.get("amount"));
            
            return paymentData;
        } else {
            throw new RuntimeException("Payment creation failed: " + response.statusCode());
        }
        
    } catch (Exception e) {
        System.err.println("❌ Payment creation failed: " + e.getMessage());
        throw e;
    }
}

// Create payment
Customer customer = new Customer("developer@example.com", "+919876543210", "Quest Developer");
PaymentRequest request = new PaymentRequest(500.00, "INR", customer);
Map<String, Object> payment = sdk.createPayment(request);`,
      expectedOutput: `🎉 Payment created successfully!
Transaction ID: TXN_1705238167890
Payment URL: https://sandbox-checkout.pinelabs.com/pay/def456ghi789
Status: pending
Amount: ₹500.0`,
      xpReward: 300,
      difficulty: "Hard",
      language: "Java"
    }
  ]
};