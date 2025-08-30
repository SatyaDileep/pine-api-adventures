import { useState } from "react";
import axios, { AxiosRequestConfig, Method } from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "./ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { Terminal } from "lucide-react";

interface ApiPlaygroundProps {
  initialUrl: string;
  initialMethod?: Method;
  initialHeaders?: Record<string, string>;
  initialBody?: Record<string, any>;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
}

const ApiPlayground = ({
  initialUrl,
  initialMethod = 'POST',
  initialHeaders = {},
  initialBody = {},
  onSuccess,
  onError,
}: ApiPlaygroundProps) => {
  const [url, setUrl] = useState(initialUrl);
  const [method, setMethod] = useState<Method>(initialMethod);
  const [headers, setHeaders] = useState(
    JSON.stringify(initialHeaders, null, 2)
  );
  const [body, setBody] = useState(JSON.stringify(initialBody, null, 2));
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRequest = async () => {
    setIsLoading(true);
    setResponse(null);
    setError(null);

    try {
      const requestConfig: AxiosRequestConfig = {
        url,
        method,
        headers: JSON.parse(headers),
        data: JSON.parse(body),
      };

      const result = await axios(requestConfig);
      setResponse(result.data);
      onSuccess(result.data);
    } catch (err: any) {
      setError(err);
      onError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Request</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Select
                  value={method}
                  onValueChange={(value) => setMethod(value as Method)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="API Endpoint URL"
                />
              </div>

              <div>
                <Label htmlFor="headers">Headers</Label>
                <Textarea
                  id="headers"
                  value={headers}
                  onChange={(e) => setHeaders(e.target.value)}
                  placeholder='{ "Content-Type": "application/json" }'
                  rows={4}
                  className="font-mono text-sm"
                />
              </div>

              <div>
                <Label htmlFor="body">Body</Label>
                <Textarea
                  id="body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder='{ "key": "value" }'
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>

              <Button onClick={handleRequest} disabled={isLoading} className="w-full bg-gradient-primary">
                {isLoading ? "Sending..." : "Send Request"}
              </Button>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-4">
          {response && (
            <Card>
              <CardHeader>
                <CardTitle>Response</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-secondary/50 p-4 rounded-md overflow-auto text-sm">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}
          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                <pre className="whitespace-pre-wrap text-sm">
                  {error.message}
                  {error.response &&
                    `\n${JSON.stringify(error.response.data, null, 2)}`}
                </pre>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApiPlayground;
