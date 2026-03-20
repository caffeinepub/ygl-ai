import Runtime "mo:core/Runtime";
import OutCall "http-outcalls/outcall";
import Text "mo:core/Text";

actor {
  var apiKey : Text = "";

  public shared ({ caller }) func setApiKey(newApiKey : Text) : async () {
    apiKey := newApiKey;
  };

  public shared ({ caller }) func sendUserMessage(content : Text) : async Text {
    if (apiKey.isEmpty()) {
      Runtime.trap("API key not set, set your API key with authenticate function first.");
    };

    "Sorry, backend AI processing not yet supported.";
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  public shared ({ caller }) func makeGetOutcall(url : Text) : async Text {
    await OutCall.httpGetRequest(url, [], transform);
  };
};
