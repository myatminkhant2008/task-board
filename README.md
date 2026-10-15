## Think

### Why should a task have `assignee_id` as a foreign key instead of storing the assignee's name as text?

A user's name can be the same as another user's name, and it can also change. Therefore, we store the user's unique `id` as `assignee_id` to identify the assigned user correctly.

### What happens if the user changes their name?

Nothing happens to the task because changing the user's name does not change their unique `id`. The user can change their name, while the `assignee_id` remains the same.

### Why should wrong email and wrong password return the same message?

If the email is wrong, the user can know that the email is incorrect. If the password is wrong, the user can know that the password is incorrect. This can reveal too much information.

Therefore, both cases should return the same message, such as `Invalid email or password.` This only tells the user that one of them is incorrect without revealing which one.
