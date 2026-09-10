USE [MinistryPlatform]
GO
/****** Object:  StoredProcedure [dbo].[report_Event_Selected_Copy_Moore_granger]    Script Date: 9/10/2026 3:35:53 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[report_Event_Selected_Copy_Moore_granger]

	@DomainID varchar(40)
	,@UserID varchar(40)
	,@PageID Int
	,@SelectionID Int
	, @EventID INT = NULL --if populated, copying is in scope.
	, @CopyProduct BIT = 0 --it only copies things if they are NOT already unique to the event.
	, @CopyGroup BIT = 0
	, @CopyForm BIT = 0
	, @NewName Nvarchar(50) = NULL



AS
BEGIN

SET NOCOUNT ON
SET FMTONLY OFF

--Kevin McCord 2024-02-06

IF EXISTS (SELECT 1 FROM Events E WHERE E.Event_ID = @EventID)
BEGIN
--Even if the SP below runs, it only copies things if they are NOT already unique to the event.
EXEC [dbo].[util_CopyMoore_Granger] 
		@EventID
		, @CopyProduct
		, @CopyGroup 
		, @CopyForm 
		, @NewName
END

CREATE TABLE #CopyMoore (Event_Title NVARCHAR(150), Event_ID INT, Event_Start_Date DATETIME, Product_ID INT, Unique_Product BIT, Group_ID INT, Unique_Group BIT, Form_ID INT, Unique_Form BIT, Product_Name Nvarchar(50), Group_Name Nvarchar(75), Form_Title Nvarchar(50))
INSERT INTO #CopyMoore 
SELECT E.Event_Title, E.Event_ID, E.Event_Start_Date
, E.Online_Registration_Product, CASE WHEN Online_Registration_Product > 0 THEN 1 END
, E.Registrant_Group, CASE WHEN E.Registrant_Group > 0 THEN 1 END
, E.Registration_Form, CASE WHEN Registration_Form > 0 THEN 1 END
, Prod.Product_Name, G.Group_Name, F.Form_Title 
 FROM Events E 
 LEFT OUTER JOIN Products Prod ON Prod.Product_ID = E.Online_Registration_Product 
 LEFT OUTER JOIN Groups G ON G.Group_ID = E.Registrant_Group 
 LEFT OUTER JOIN Forms F ON F.Form_ID = E.Registration_Form 
WHERE E.Event_ID IN (SELECT Record_ID FROM dp_Selected_Records SR INNER JOIN dp_Selections S ON S.Selection_ID = SR.Selection_ID  INNER JOIN dbo.dp_Users U ON U.[User_ID] = S.[User_ID] AND CONVERT(VARCHAR(40),U.User_GUID) = @UserID INNER JOIN dbo.dp_Pages P ON P.Page_ID = @PageID and P.Table_Name = 'Events' WHERE S.Page_ID = @PageID AND ((S.Selection_ID = @SelectionID AND @SelectionID > 0) OR (S.Selection_Name = 'dp_DEFAULT' AND @SelectionID < 1 AND Sub_Page_ID IS NULL)))

UPDATE #CopyMoore SET Unique_Product  = 0
WHERE EXISTS (SELECT 1 FROM Events E WHERE E.Online_Registration_Product = #CopyMoore.Product_ID AND E.Event_ID <> #CopyMoore.Event_ID)

UPDATE #CopyMoore SET Unique_Form = 0
WHERE EXISTS (SELECT 1 FROM Events E WHERE E.Registration_Form = #CopyMoore.Form_ID AND E.Event_ID <> #CopyMoore.Event_ID)

UPDATE #CopyMoore SET Unique_Group = 0
WHERE EXISTS (SELECT 1 FROM Events E WHERE E.Registrant_Group = #CopyMoore.Group_ID AND E.Event_ID <> #CopyMoore.Event_ID)

SELECT Event_Title, Event_ID, Event_Start_Date, Product_ID, Unique_Product, Group_ID, Unique_Group, Form_ID, Unique_Form, Product_Name, Group_Name, Form_Title
FROM #CopyMoore 

DROP TABLE #CopyMoore

END
