### **Limitations and Known Issues**  

1. **Single User per Browser Session**  
   - Only one user can be logged in at a time within a single browser session.  

2. **Sign-In and Registration Redirect Issue**  
   - Occasionally, after successfully signing up or logging in, users are not automatically redirected to the main page.  
   - **Workaround:** Refresh the page and log in again.  

3. **Safari Login Issue (CORS & Cookies)**  
   - Safari does not support the `Secure` flag on HTTP connections, which is required for `SameSite=None` settings in CORS.  
   - This prevents login functionality from working properly in Safari.  
   - **Reference:** [Stack Overflow](https://stackoverflow.com/questions/58525719/safari-not-sending-cookie-even-after-setting-samesite-none-secure)