Lab 8 Accessibility Reflection

Name Vlad Kolesnik  
Date March 10 2026

Reflection

The most surprising issue for me was how much damage comes from small html. At first I thought accessibility was mostly about colors and alt text. Then I saw how a div that looks like a button can break keyboard use and assistive tech use. The page can look normal and still block people/you

The POUR framework helped me stay on top of finding the issues. Perceivable helped me check image color contrast and text. Operable helped me check keyboard behavior. Understandable helped me focus on labels and error messages. Robust helped me verify semantic html roles and states without this article i would have missed alot or wouldnt know where to look first.

When I use getByRole first my code has to use real semantic elements. When I use getByLabelText my form labels have to be correct. When I use getByText it will check visible text but not first option. But if someone changes a button back to a div then getByRole will fail and catch this bug fast 

Key Concepts

1. Semantic html is crucial for accessibility
2. Keyboard support should work by default with real form and button elements
3. POUR gives a clear method to audit and fix accessibility issues
