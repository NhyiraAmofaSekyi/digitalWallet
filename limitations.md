### **Limitations** 

1. **Single User per Browser Session**  
   - Only one user can be logged in per browser session at a time.

2. **Safari Login Issue (CORS & Cookies)**  
   - Safari does not allow the `Secure` flag on HTTP connections, which is required for `SameSite=None` settings in CORS.  
   - This prevents login functionality from working properly in Safari.  
   - **Reference:** [Stack Overflow](https://stackoverflow.com/questions/58525719/safari-not-sending-cookie-even-after-setting-samesite-none-secure)  

