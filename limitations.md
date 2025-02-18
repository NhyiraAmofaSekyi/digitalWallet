### **Limitations and Known Issues**  

1. **Single User per Browser Session**  
   - Only one user can be logged in at a time within a single browser session.  

2. **Sign-In and Registration Redirect Issue** *(Previously Observed During Development)*  
   - During development, there was a bug where users were not automatically redirected to the main page after signing up or logging in.  
   - This issue has been patched, but if it resurfaces, **refresh the page and log in again** as a workaround.  

3. **Safari Login Issue (CORS & Cookies)**  
   - Safari does not support the `Secure` flag on HTTP connections, which is required for `SameSite=None` settings in CORS.  
   - This prevents login functionality from working properly in Safari.  
   - **Reference:** [Stack Overflow](https://stackoverflow.com/questions/58525719/safari-not-sending-cookie-even-after-setting-samesite-none-secure)