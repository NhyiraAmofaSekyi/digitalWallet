using System.Runtime.Serialization;
using System.Text.Json.Serialization;
namespace DigitalWalletAPI.Enums

{
    [JsonConverter(typeof(JsonStringEnumConverter))] 
    public enum TransactionStatus
    {
        [EnumMember(Value = "pending")]
        pending,
        [EnumMember(Value = "completed")]
        completed,
        [EnumMember(Value = "failed")]
        failed
    }

[JsonConverter(typeof(JsonStringEnumConverter))] 
    public enum TransactionType
    {
        [EnumMember(Value = "transfer")]
        transfer,

        [EnumMember(Value = "deposit")]
        deposit,

        [EnumMember(Value = "withdrawal")]
        withdrawal
    }
}
