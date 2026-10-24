## 1. A practical testing strategy for TrackEx

I would approach your project in this order:
1. Authentication and authorization
   
   Test missing/invalid authentication, successful authentication, role restrictions if applicable, and whether one user can access another user's data.
2. Validation and error handling
   
   Test malformed input, missing required fields, duplicate registration, incorrect credentials, and expected status codes.
3. Core expense functionality
   
   Test creating, listing, updating, and deleting expenses. Verify that totals are correct and that users only affect their own records.
4. Integration tests
   
   Test a few critical API flows with a test database, ensuring your middleware, controllers, models, and routes work together.
5. Frontend behavior
   
   Test important user-visible behavior, such as authentication state, protected navigation, form validation feedback, and logout.
For security-sensitive features, pay particular attention to authorization. For example, test that user A cannot retrieve, edit, or delete user B's expense merely by changing an ID in the request. This is a more important test than checking that a trivial utility function was called once. 


## Conventions and guidelines worth following

There isn't a universal rule that every function needs three tests or that every project needs 80% coverage. There are, however, established practices that make tests more reliable.

|Convention|What it means|
|---|---|
|Arrange–Act–Assert (AAA)|Prepare inputs, execute the code, then assert the result|
|One behavior per test|A test should have one clear purpose, even if it contains multiple assertions|
|Descriptive test names|State the condition and expected outcome|
|Independent tests|One test should not depend on another test having run first|
|Deterministic tests|The same code and setup should produce the same result|
|Test isolation|Avoid using production data or sharing mutable test state unexpectedly|
|Test edge cases|Include boundary values, missing inputs, and failure scenarios where relevant|
|Clean up mocks|Clear or restore mock state when necessary to prevent tests interfering with each other|