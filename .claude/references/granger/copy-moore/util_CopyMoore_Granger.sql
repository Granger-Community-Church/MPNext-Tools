USE [MinistryPlatform]
GO
/****** Object:  StoredProcedure [dbo].[util_CopyMoore_Granger]    Script Date: 9/10/2026 3:40:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


ALTER PROCEDURE [dbo].[util_CopyMoore_Granger]

        @EventID INT
        , @CopyProduct BIT = 0
        , @CopyGroup BIT = 0
        , @CopyForm BIT = 0
        , @NewName Nvarchar(50) = NULL
AS
BEGIN

--Kevin McCord
--2024-02-06
--Based on the EventID and instructiosn in parameters copy certain items not copied by Platform.
--TBD add logic to copy groups from Event Rooms?
--TBD add logic to copy add to group groups from pop?


--Internal Parameters
DECLARE @NewProductID INT
, @NewGroupID INT
, @NewFormID INT
, @ProductOptionGroupID INT
, @NewProductOptionGroupID INT
, @testmode BIT = 0 --set to 1 if running this directly (will negatively impact report)

    --Audit Logging Parameters Local
        DECLARE @AuditUserName NVARCHAR(254) = 'CopyMooreActionableReport'
        , @AuditUserID INT = 0
        DECLARE @ToBeAudited mp_ServiceAuditLog -- (Table_Name NVARCHAR(50), Record_ID INT, Audit_Description Varchar(50), [User_ID] INT, [User_Name] NVARCHAR(254), Field_Name NVARCHAR(50), Field_Label NVARCHAR(50), Previous_Value NVARCHAR(MAX), New_Value NVARCHAR(MaX), Previous_ID INT, New_ID INT)


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
WHERE E.Event_ID = @EventID

UPDATE #CopyMoore SET Unique_Product  = 0
WHERE EXISTS (SELECT 1 FROM Events E WHERE E.Online_Registration_Product = #CopyMoore.Product_ID AND E.Event_ID<> @EventID)

UPDATE #CopyMoore SET Unique_Form = 0
WHERE EXISTS (SELECT 1 FROM Events E WHERE E.Registration_Form = #CopyMoore.Form_ID AND E.Event_ID<> @EventID)

UPDATE #CopyMoore SET Unique_Group = 0
WHERE EXISTS (SELECT 1 FROM Events E WHERE E.Registrant_Group = #CopyMoore.Group_ID AND E.Event_ID<> @EventID)

IF @testmode = 1
BEGIN
SELECT * FROM #CopyMoore
END

IF @NewName IS NULL
BEGIN
SET @NewName = (SELECT top 1 LEFT(Event_Title + SPACE(1) + FORMAT(Event_Start_date,'d'),50) fROM #CopyMoore CM WHERE CM.Event_ID = @EventID)
END

IF @CopyProduct = 1 AND EXISTS (SELECT 1 FROM #CopyMoore WHERE Unique_Product = 0 AND Event_ID = @EventID)
BEGIN
INSERT INTO [dbo].[Products]
           ([Product_Name]
           ,[Congregation_ID]
           ,[Description]
           ,[Base_Price]
           ,[Deposit_Price]
           ,[Active]
           ,[Domain_ID]
           ,[Price_Currency])
            OUTPUT 'Products', INSERTED.Product_ID, 'Created',@AuditUserID,@AuditUserName,NULL,NULL,NULL,NULL,NULL,NULL
            INTO @ToBeAudited
    SELECT ISNULL(@NewName,Products.[Product_Name]) AS Product_Name
           ,[Congregation_ID]
           ,[Description]
           ,[Base_Price]
           ,[Deposit_Price]
           ,[Active]
           ,[Domain_ID]
           ,[Price_Currency]
    FROM Products
     INNER JOIN #CopyMoore CM ON CM.Product_ID  = Products.Product_ID
    WHERE CM.Event_ID = @EventID
    SET @NewProductID = Scope_Identity()

    IF EXISTS (SELECT 1 FROM Product_Option_Groups POG INNER JOIN #CopyMoore CM ON CM.Product_ID = POG.Product_ID)
    BEGIN

    DECLARE CursorPOGPOP CURSOR FAST_FORWARD FOR
    SELECT Product_Option_Group_ID FROM Product_Option_Groups POG INNER JOIN #CopyMoore CM ON CM.Product_ID = POG.Product_ID

    OPEN CursorPOGPOP FETCH NEXT FROM CursorPOGPOP INTO @ProductOptionGroupID

    WHILE @@FETCH_STATUS = 0
    BEGIN
        INSERT INTO [dbo].[Product_Option_Groups]
           ([Option_Group_Name]
           ,[Product_ID]
           ,[Description]
           ,[Mutually_Exclusive]
           ,[Required]
           ,[Domain_ID]
           ,[Note_Label]
           ,[Online_Sort_Order])
            OUTPUT 'Product_Option_Groups', INSERTED.Product_Option_Group_ID, 'Created',@AuditUserID,@AuditUserName,NULL,NULL,NULL,NULL,NULL,NULL
            INTO @ToBeAudited
            SELECT [Option_Group_Name]
           ,[Product_ID] = @NewProductID
           ,[Description]
           ,[Mutually_Exclusive]
           ,[Required]
           ,[Domain_ID]
           ,[Note_Label]
           ,[Online_Sort_Order]
        FROM Product_Option_Groups POG
        WHERE POG.Product_Option_Group_ID = @ProductOptionGroupID
        SET @NewProductOptionGroupID = SCOPE_IDENTITY()
        IF @NewProductOptionGroupID > 0
        BEGIN
        INSERT INTO [dbo].[Product_Option_Prices]
           ([Product_Option_Group_ID]
           ,[Option_Price]
           ,[Option_Title]
           ,[Active]
           ,[Qty_Allowed]
           ,[Domain_ID]
           ,[Add_to_Group]
           ,[Sort_Order]
           ,[Max_Qty]
           ,[Days_Out_To_Hide]
           ,[Promo_Code]
           ,[Min_Qty]
           ,[Attending_Online])
            OUTPUT 'Product_Option_Prices', INSERTED.Product_Option_Price_ID, 'Created',@AuditUserID,@AuditUserName,NULL,NULL,NULL,NULL,NULL,NULL
            INTO @ToBeAudited
           SELECT [Product_Option_Group_ID] = @NewProductOptionGroupID
           ,[Option_Price]
           ,[Option_Title]
           ,[Active]
           ,[Qty_Allowed]
           ,[Domain_ID]
           ,[Add_to_Group]
           ,[Sort_Order]
           ,[Max_Qty]
           ,[Days_Out_To_Hide]
           ,[Promo_Code]
           ,[Min_Qty]
           ,[Attending_Online]
           FROM Product_Option_Prices POP
           WHERE POP.Product_Option_Group_ID = @ProductOptionGroupID
           END
           SET @ProductOptionGroupID = NULL
           SET @NewProductOptionGroupID = NULL
        FETCH NEXT FROM CursorPOGPOP INTO @ProductOptionGroupID
        END

        CLOSE CursorPOGPOP
        DEALLOCATE CursorPOGPOP

    END
    IF @NewProductID > 0
    BEGIN
    UPDATE Events SET Online_Registration_Product = @NewProductID
    OUTPUT 'Events', INSERTED.Event_ID, 'Updated',@AuditUserID,@AuditUserName,'Online_Registration_Product','Online Registration Product',CM.Product_Name,ISNULL(@NewName,CM.Product_Name),DELETED.Online_Registration_Product,INSERTED.Online_Registration_Product
    INTO @ToBeAudited
    FROM Events E
     INNER JOIN #CopyMoore CM ON CM.Event_ID = E.Event_ID
    WHERE E.Event_ID = @EventID
    UPDATE #CopyMoore SET Unique_Product  = 1, Product_ID = @NewProductID WHERE Event_ID = @EventID
    END
END

IF @CopyGroup = 1 AND EXISTS (SELECT 1 FROM #CopyMoore WHERE Unique_Group = 0 AND Event_ID = @EventID)
BEGIN
INSERT INTO [dbo].[Groups]
           ([Group_Name]
           ,[Group_Type_ID]
           ,[Ministry_ID]
           ,[Congregation_ID]
           ,[Primary_Contact]
           ,[Description]
           ,[Start_Date]
           ,[End_Date]
           ,[Target_Size]
           ,[Parent_Group]
           ,[Priority_ID]
           ,[Offsite_Meeting_Address]
           ,[Group_Is_Full]
           ,[Available_Online]
           ,[Meets_Online]
           ,[Life_Stage_ID]
           ,[Group_Focus_ID]
           ,[Meeting_Time]
           ,[Meeting_Day_ID]
           ,[Meeting_Frequency_ID]
           ,[Meeting_Duration_ID]
           ,[Create_Next_Meeting]
           ,[Required_Book]
           ,[Descended_From]
           ,[Background_Check_Required]
           ,[Domain_ID]
           ,[Secure_Check-in]
           ,[Suppress_Nametag]
           ,[Suppress_Care_Note]
           ,[On_Classroom_Manager]
           ,[Promote_to_Group]
           ,[Age_in_Months_to_Promote]
           ,[Promote_Weekly]
           ,[Promotion_Date]
           ,[Promote_Participants_Only]
           ,[Promotion_Milestone]
           ,[Send_Attendance_Notification]
           ,[Send_Service_Notification]
           ,[Enable_Discussion]
           ,[SMS_Number]
           ,[Show_All_Participants_in_My_Events]
           ,[Next_Scheduled_Meeting]
           ,[Default_Meeting_Room]
           ,[Available_On_App])
            OUTPUT 'Groups', INSERTED.Group_ID, 'Created',@AuditUserID,@AuditUserName,NULL,NULL,NULL,NULL,NULL,NULL
            INTO @ToBeAudited
SELECT  ISNULL(@NewName,Groups.[Group_Name]) AS Group_Name
           ,[Group_Type_ID]
           ,[Ministry_ID]
           ,[Congregation_ID]
           ,[Primary_Contact]
           ,[Description]
           ,GETDATE() AS [Start_Date]
           ,NULL AS [End_Date]
           ,[Target_Size]
           ,[Parent_Group]
           ,[Priority_ID]
           ,[Offsite_Meeting_Address]
           ,[Group_Is_Full]
           ,[Available_Online]
           ,[Meets_Online]
           ,[Life_Stage_ID]
           ,[Group_Focus_ID]
           ,[Meeting_Time]
           ,[Meeting_Day_ID]
           ,[Meeting_Frequency_ID]
           ,[Meeting_Duration_ID]
           ,[Create_Next_Meeting]
           ,[Required_Book]
           ,[Descended_From]
           ,[Background_Check_Required]
           ,[Domain_ID]
           ,[Secure_Check-in]
           ,[Suppress_Nametag]
           ,[Suppress_Care_Note]
           ,[On_Classroom_Manager]
           ,[Promote_to_Group]
           ,[Age_in_Months_to_Promote]
           ,[Promote_Weekly]
           ,[Promotion_Date]
           ,[Promote_Participants_Only]
           ,[Promotion_Milestone]
           ,[Send_Attendance_Notification]
           ,[Send_Service_Notification]
           ,[Enable_Discussion]
           ,[SMS_Number]
           ,[Show_All_Participants_in_My_Events]
           ,[Next_Scheduled_Meeting]
           ,[Default_Meeting_Room]
           ,[Available_On_App]
FROM Groups
 INNER JOIN #CopyMoore CM ON CM.Group_ID = Groups.Group_ID
WHERE CM.Event_ID = @EventID

SET @NewGroupID = Scope_Identity()
    IF @NewGroupID > 0
    BEGIN
    UPDATE Events SET Registrant_Group = @NewGroupID
    OUTPUT 'Events', INSERTED.Event_ID, 'Updated',@AuditUserID,@AuditUserName,'Registrant_Group','Registrant Group',CM.Group_Name,ISNULL(@NewName,CM.Group_Name),DELETED.Registrant_Group,INSERTED.Registrant_Group
    INTO @ToBeAudited
    From Events E
     INNER JOIN #CopyMoore CM ON CM.Event_ID = E.Event_ID
    WHERE E.Event_ID = @EventID

    UPDATE Event_Rooms SET Group_ID = @NewGroupID
    --TBD Audit log
    FROM Event_Rooms ER
     INNER JOIN #CopyMoore CM ON CM.Group_ID = ER.Group_ID AND CM.Event_ID = ER.Event_ID
    WHERE ER.Event_ID = @EventID

    UPDATE Event_Groups SET Group_ID = @NewGroupID
    --TBD Audit log
    FROM Event_Groups EG
     INNER JOIN #CopyMoore CM ON CM.Group_ID = EG.Group_ID AND CM.Event_ID = EG.Event_ID
    WHERE EG.Event_ID = @EventID

    UPDATE #CopyMoore SET Unique_Group = 1, Group_ID = @NewGroupID WHERE Event_ID = @EventID
    END
END

IF @CopyForm = 1 AND EXISTS (SELECT 1 FROM #CopyMoore WHERE Unique_Form = 0 AND Event_ID = @EventID)
BEGIN
INSERT INTO [dbo].[Forms]
           ([Form_Title]
           ,[Congregation_ID]
           ,[Ministry_ID]
           ,[Internal_Notes]
           ,[Instructions]
           ,[Get_Contact_Info]
           ,[Get_Address_Info]
           ,[Domain_ID]
          -- ,[Form_GUID]
           ,[End_Date]
           ,[Complete_Message]
           ,[Primary_Contact]
           ,[Notify]
           ,[Create_Unmatched_Contacts]
           ,[Response_Message]
           ,[Months_Till_Expires]
           ,[Expiring_Soon_Days]
           ,[Scholarship_PromoCode]
           ,[Force_Login])
            OUTPUT 'Forms', INSERTED.Form_ID, 'Created',@AuditUserID,@AuditUserName,NULL,NULL,NULL,NULL,NULL,NULL
            INTO @ToBeAudited
SELECT  ISNULL(@NewName,Forms.[Form_Title]) AS Form_Title
           ,[Congregation_ID]
           ,[Ministry_ID]
           ,[Internal_Notes]
           ,[Instructions]
           ,[Get_Contact_Info]
           ,[Get_Address_Info]
           ,[Domain_ID]
           --,[Form_GUID]
           ,[End_Date]
           ,[Complete_Message]
           ,[Primary_Contact]
           ,[Notify]
           ,[Create_Unmatched_Contacts]
           ,[Response_Message]
           ,[Months_Till_Expires]
           ,[Expiring_Soon_Days]
           ,[Scholarship_PromoCode]
           ,[Force_Login]
FROM Forms
 INNER JOIN #CopyMoore CM ON CM.Form_ID = Forms.Form_ID
WHERE CM.Event_ID = @EventID

SET @NewFormID = Scope_Identity()
    IF @NewFormID > 0
    BEGIN
    INSERT INTO [dbo].[Form_Fields]
           ([Field_Order]
           ,[Field_Label]
           ,[Field_Type_ID]
           ,[Field_Values]
           ,[Required]
           ,[Form_ID]
           ,[Domain_ID]
           ,[Placement_Required]
           ,[Alternate_Label]
           ,[Attribute_ID]
           ,[Days_Attribute_Is_Valid]
           ,[Feedback_Type_ID]
           ,[Milestone_ID]
           ,[Program_ID]
           ,[Milestone_Value]
           ,[PlusOne_Field]
           ,[Is_Hidden]
           ,[Depends_On]
           ,[Depends_On_Value])
            OUTPUT 'Form_Fields', INSERTED.Form_Field_ID, 'Created',@AuditUserID,@AuditUserName,NULL,NULL,NULL,NULL,NULL,NULL
            INTO @ToBeAudited
    SELECT [Field_Order]
           ,[Field_Label]
           ,[Field_Type_ID]
           ,[Field_Values]
           ,[Required]
           ,@NewFormID AS [Form_ID]
           ,[Domain_ID]
           ,[Placement_Required]
           ,[Alternate_Label]
           ,[Attribute_ID]
           ,[Days_Attribute_Is_Valid]
           ,[Feedback_Type_ID]
           ,[Milestone_ID]
           ,[Program_ID]
           ,[Milestone_Value]
           ,[PlusOne_Field]
           ,[Is_Hidden]
           ,[Depends_On]
           ,[Depends_On_Value]
    FROM Form_Fields
     INNER JOIN #CopyMoore CM ON CM.Form_ID = Form_Fields.Form_ID
    WHERE CM.Event_ID = @EventID

    END
    IF @NewFormID > 0
    BEGIN
    UPDATE Events SET Registration_Form = @NewFormID
    OUTPUT 'Events', INSERTED.Event_ID, 'Updated',@AuditUserID,@AuditUserName,'Registration_Form','Registration Form',CM.Form_Title,ISNULL(@NewName,CM.Form_Title),DELETED.Registration_Form,INSERTED.Registration_Form
    INTO @ToBeAudited
    From Events E
     INNER JOIN #CopyMoore CM ON CM.Event_ID = E.Event_ID
    WHERE E.Event_ID = @EventID

    UPDATE #CopyMoore SET Unique_Form = 1, Form_ID = @NewFormID WHERE Event_ID = @EventID
    END
END

IF @testmode = 1
BEGIN
SELECT Event_Title,    Event_ID,    Event_Start_Date,    Product_ID,    Unique_Product,    Group_ID,    Unique_Group,    Form_ID,    Unique_Form
FROM #CopyMoore
END

    IF EXISTS (SELECT 1 FROM @ToBeAudited)
    BEGIN
        EXEC dbo.util_createauditlogentries @ToBeAudited
    END

DROP TABLE #CopyMoore


END
